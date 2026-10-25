import User from '../models/User.js';
import Provider from '../models/Provider.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomInt } from 'node:crypto';
import AdminCredential from '../models/AdminCredential.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { isEmailConfigured, sendAdminPasswordResetCode } from '../services/email.js';
import { hasOnlyAllowedFields } from '../utils/requestValidation.js';

const PASSWORD_HASH_PATTERN = /^\$2[aby]\$(?:0[4-9]|[12]\d|3[01])\$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getAdminConfiguration = () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!email || !PASSWORD_HASH_PATTERN.test(passwordHash || '') || !process.env.JWT_SECRET) {
    return null;
  }

  return { email, passwordHash };
};

const getOrCreateAdminCredential = async (passwordHash) => {
  let credential;
  try {
    credential = await AdminCredential.findByIdAndUpdate(
      'admin',
      { $setOnInsert: { passwordHash } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
  } catch (error) {
    if (error.code !== 11000) throw error;
    credential = await AdminCredential.findById('admin');
    if (!credential) throw error;
  }

  if (!credential.passwordHash || !PASSWORD_HASH_PATTERN.test(credential.passwordHash)) {
    throw new Error('Stored admin credential is invalid');
  }

  return credential;
};

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  const configuration = getAdminConfiguration();

  if (!configuration) {
    console.error('Admin login is unavailable because required server configuration is missing.');
    return res.status(503).json({ success: false, message: 'Admin login is unavailable' });
  }

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    password.length < 1 ||
    password.length > 256
  ) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const credential = await getOrCreateAdminCredential(configuration.passwordHash);
  const emailMatches = email.trim().toLowerCase() === configuration.email;
  const passwordMatches = await bcrypt.compare(password, credential.passwordHash);
  if (!emailMatches || !passwordMatches) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const user = { id: 'environment-admin', name: 'Admin', email: configuration.email, role: 'admin' };
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '1d',
  });

  res.status(200).json({
    success: true,
    message: 'Admin login successful',
    token,
    user,
  });
});

export const requestAdminPasswordReset = asyncHandler(async (req, res) => {
  const configuration = getAdminConfiguration();
  if (!configuration) {
    console.error('Admin password reset is unavailable because required server configuration is missing.');
    return res.status(503).json({ success: false, message: 'Password reset is unavailable' });
  }

  if (!isEmailConfigured()) {
    console.error('Admin password reset is unavailable because SMTP configuration is incomplete.');
    return res.status(503).json({ success: false, message: 'Password reset email is not configured' });
  }

  if (!hasOnlyAllowedFields(req.body, ['email'])) {
    return res.status(400).json({ success: false, message: 'Invalid password reset request.' });
  }

  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
  }

  if (email !== configuration.email) {
    return res.status(200).json({
      success: true,
      message: 'If the address matches the configured admin account, a reset code will be sent.',
    });
  }

  const now = new Date();
  await getOrCreateAdminCredential(configuration.passwordHash);

  const code = String(randomInt(0, 1000000)).padStart(6, '0');
  const codeHash = await bcrypt.hash(code, 10);
  const minuteAgo = new Date(now.getTime() - 60 * 1000);
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const resetValues = {
    resetCodeHash: codeHash,
    resetCodeExpiresAt: new Date(now.getTime() + 10 * 60 * 1000),
    resetCodeAttempts: 0,
    resetRequestedAt: now,
  };
  const requestCooldownPassed = {
    $or: [
      { resetRequestedAt: null },
      { resetRequestedAt: { $lte: minuteAgo } },
    ],
  };
  let credential = await AdminCredential.findOneAndUpdate(
    {
      _id: 'admin',
      $and: [
        requestCooldownPassed,
        {
          $or: [
            { resetRequestWindowStartedAt: null },
            { resetRequestWindowStartedAt: { $lte: hourAgo } },
          ],
        },
      ],
    },
    {
      $set: {
        ...resetValues,
        resetRequestWindowStartedAt: now,
        resetRequestCount: 1,
      },
    },
    { new: true }
  );

  if (!credential) {
    credential = await AdminCredential.findOneAndUpdate(
      {
        _id: 'admin',
        ...requestCooldownPassed,
        resetRequestWindowStartedAt: { $gt: hourAgo, $lte: now },
        resetRequestCount: { $lt: 5 },
      },
      {
        $set: resetValues,
        $inc: { resetRequestCount: 1 },
      },
      { new: true }
    );
  }

  if (!credential) {
    return res.status(429).json({
      success: false,
      message: 'Please wait before requesting another reset code.',
    });
  }

  try {
    await sendAdminPasswordResetCode(configuration.email, code);
  } catch (error) {
    await AdminCredential.updateOne(
      { _id: 'admin', resetCodeHash: codeHash },
      {
        $set: { resetCodeHash: null, resetCodeExpiresAt: null, resetCodeAttempts: 0 },
      }
    );
    console.error('Admin password reset email delivery failed.', error.code || 'EMAIL_DELIVERY_ERROR');
    return res.status(502).json({
      success: false,
      message: 'Reset email could not be sent. Try again later.',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'If the address matches the configured admin account, a reset code will be sent.',
  });
});

export const resetAdminPassword = asyncHandler(async (req, res) => {
  const configuration = getAdminConfiguration();
  if (!configuration) {
    console.error('Admin password reset is unavailable because required server configuration is missing.');
    return res.status(503).json({ success: false, message: 'Password reset is unavailable' });
  }

  if (!hasOnlyAllowedFields(req.body, ['email', 'code', 'newPassword'])) {
    return res.status(400).json({ success: false, message: 'Invalid password reset request.' });
  }

  const { email, code, newPassword } = req.body;
  if (
    typeof email !== 'string' ||
    typeof code !== 'string' ||
    !/^\d{6}$/.test(code) ||
    typeof newPassword !== 'string' ||
    newPassword.length < 12 ||
    newPassword.length > 128
  ) {
    return res.status(400).json({
      success: false,
      message: 'Enter the six-digit code and a new password of 12 to 128 characters.',
    });
  }

  if (email.trim().toLowerCase() !== configuration.email) {
    return res.status(400).json({ success: false, message: 'Invalid or expired reset code.' });
  }

  const credential = await AdminCredential.findById('admin');
  if (
    !credential?.resetCodeHash ||
    !credential.resetCodeExpiresAt ||
    credential.resetCodeExpiresAt <= new Date() ||
    credential.resetCodeAttempts >= 5
  ) {
    return res.status(400).json({ success: false, message: 'Invalid or expired reset code.' });
  }

  const codeMatches = await bcrypt.compare(code, credential.resetCodeHash);
  if (!codeMatches) {
    await AdminCredential.updateOne(
      {
        _id: 'admin',
        resetCodeHash: credential.resetCodeHash,
        resetCodeExpiresAt: { $gt: new Date() },
        resetCodeAttempts: { $lt: 5 },
      },
      { $inc: { resetCodeAttempts: 1 } }
    );
    return res.status(400).json({ success: false, message: 'Invalid or expired reset code.' });
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 12);
  const updatedCredential = await AdminCredential.findOneAndUpdate(
    {
      _id: 'admin',
      resetCodeHash: credential.resetCodeHash,
      resetCodeExpiresAt: { $gt: new Date() },
      resetCodeAttempts: { $lt: 5 },
    },
    {
      $set: { passwordHash: newPasswordHash, resetCodeAttempts: 0 },
      $unset: { resetCodeHash: 1, resetCodeExpiresAt: 1 },
    },
    { new: true }
  );

  if (!updatedCredential) {
    return res.status(400).json({ success: false, message: 'Invalid or expired reset code.' });
  }

  return res.status(200).json({
    success: true,
    message: 'Admin password updated. Sign in with your new password.',
  });
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalCustomers = await User.countDocuments({ role: 'customer' });
  const totalProviders = await User.countDocuments({ role: 'provider' });
  const totalServices = await User.countDocuments({ role: 'admin' });
  const totalBookings = await Booking.countDocuments();
  const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
  const completedBookings = await Booking.countDocuments({ status: 'Completed' });
  const cancelledBookings = await Booking.countDocuments({ status: 'Cancelled' });

  const payments = await Payment.find({ status: 'Paid' });
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  res.status(200).json({
    success: true,
    stats: {
      totalCustomers,
      totalProviders,
      totalServices,
      totalBookings,
      pendingBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue,
    },
  });
});

export const getAllCustomers = asyncHandler(async (req, res) => {
  const customers = await User.find({ role: 'customer' }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: customers.length,
    customers,
  });
});

export const getCustomerById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const customer = await User.findById(id);

  if (!customer || customer.role !== 'customer') {
    return res.status(404).json({
      success: false,
      message: 'Customer not found',
    });
  }

  const bookingCount = await Booking.countDocuments({ customerId: id });
  const completedBookings = await Booking.countDocuments({
    customerId: id,
    status: 'Completed',
  });

  res.status(200).json({
    success: true,
    customer: {
      ...customer.toObject(),
      bookingCount,
      completedBookings,
    },
  });
});

export const getAllProviders = asyncHandler(async (req, res) => {
  const providers = await Provider.find()
    .populate('userId', 'name email phone')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: providers.length,
    providers,
  });
});

export const verifyProvider = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isVerified } = req.body;

  const provider = await Provider.findByIdAndUpdate(
    id,
    { isVerified },
    { new: true }
  );

  if (!provider) {
    return res.status(404).json({
      success: false,
      message: 'Provider not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Provider verification status updated',
    provider,
  });
});

export const activateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    { isActive },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'User status updated',
    user,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'User deleted',
  });
});

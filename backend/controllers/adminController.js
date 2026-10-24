import User from '../models/User.js';
import Provider from '../models/Provider.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../middleware/errorHandler.js';

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (
    !configuredEmail ||
    !/^\$2[aby]\$(?:0[4-9]|[12]\d|3[01])\$/.test(passwordHash || '') ||
    !process.env.JWT_SECRET
  ) {
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

  const emailMatches = email.trim().toLowerCase() === configuredEmail;
  const passwordMatches = await bcrypt.compare(password, passwordHash);
  if (!emailMatches || !passwordMatches) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const user = { id: 'environment-admin', name: 'Admin', email: configuredEmail, role: 'admin' };
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

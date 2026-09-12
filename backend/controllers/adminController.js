import User from '../models/User.js';
import Provider from '../models/Provider.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import { asyncHandler } from '../middleware/errorHandler.js';

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

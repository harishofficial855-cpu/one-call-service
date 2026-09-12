import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Notification from '../models/Notification.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createBooking = asyncHandler(async (req, res) => {
  const {
    serviceId,
    date,
    timeSlot,
    location,
    customerDetails,
    serviceAmount,
    discount = 0,
    instructions = '',
    paymentMethod = 'Cash on Service',
  } = req.body;

  if (!serviceId || !date || !timeSlot || !serviceAmount) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields',
    });
  }

  const service = await Service.findById(serviceId);
  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found',
    });
  }

  const finalAmount = serviceAmount - discount;

  const booking = new Booking({
    customerId: req.user.id,
    serviceId,
    serviceName: service.name,
    category: service.category,
    date: new Date(date),
    timeSlot,
    location,
    customerDetails: {
      fullName: customerDetails.fullName || '',
      phone: customerDetails.phone || req.user.phone || '',
      email: customerDetails.email || req.user.email || '',
    },
    serviceAmount,
    discount,
    finalAmount,
    instructions,
    paymentMethod,
    status: 'Pending',
  });

  await booking.save();

  // Create notification
  const notification = new Notification({
    userId: req.user.id,
    type: 'Booking Created',
    title: 'Booking Created',
    message: `Your booking for ${service.name} has been created`,
    bookingId: booking._id,
  });
  await notification.save();

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    booking,
    bookingId: booking.bookingId,
  });
});

export const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id)
    .populate('serviceId', 'name category basePrice')
    .populate('providerId', 'name phone');

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  // Check authorization
  if (booking.customerId.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  res.status(200).json({
    success: true,
    booking,
  });
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const { status } = req.query;

  let filter = { customerId: req.user.id };

  if (status) {
    filter.status = status;
  }

  const bookings = await Booking.find(filter)
    .populate('serviceId', 'name category basePrice')
    .populate('providerId', 'name phone rating')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = [
    'Pending',
    'Confirmed',
    'Provider Assigned',
    'On The Way',
    'Service Started',
    'Completed',
    'Cancelled',
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status',
    });
  }

  const booking = await Booking.findById(id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  booking.status = status;
  if (status === 'Completed') {
    booking.completedAt = Date.now();
  }

  await booking.save();

  // Create notification
  const notification = new Notification({
    userId: booking.customerId,
    type: `Booking ${status}`,
    title: `Booking Status Updated`,
    message: `Your booking status has been updated to ${status}`,
    bookingId: booking._id,
  });
  await notification.save();

  res.status(200).json({
    success: true,
    message: 'Booking status updated successfully',
    booking,
  });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { cancelReason } = req.body;

  const booking = await Booking.findById(id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  if (booking.status === 'Cancelled') {
    return res.status(400).json({
      success: false,
      message: 'Booking is already cancelled',
    });
  }

  if (booking.status === 'Completed') {
    return res.status(400).json({
      success: false,
      message: 'Cannot cancel a completed booking',
    });
  }

  booking.status = 'Cancelled';
  booking.cancelReason = cancelReason || '';

  await booking.save();

  // Create notification
  const notification = new Notification({
    userId: booking.customerId,
    type: 'Booking Cancelled',
    title: 'Booking Cancelled',
    message: 'Your booking has been cancelled',
    bookingId: booking._id,
  });
  await notification.save();

  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    booking,
  });
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const { status } = req.query;

  let filter = {};

  if (status) {
    filter.status = status;
  }

  const bookings = await Booking.find(filter)
    .populate('customerId', 'name phone email')
    .populate('providerId', 'name phone')
    .populate('serviceId', 'name category')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  });
});

import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createPayment = asyncHandler(async (req, res) => {
  const {
    bookingId,
    amount,
    paymentMethod = 'Cash on Service',
    transactionId = '',
  } = req.body;

  if (!bookingId || !amount) {
    return res.status(400).json({
      success: false,
      message: 'Booking ID and amount are required',
    });
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  const payment = new Payment({
    bookingId,
    customerId: req.user.id,
    amount,
    paymentMethod,
    transactionId,
    status: paymentMethod === 'Cash on Service' ? 'Pending' : 'Paid',
    paymentDate: paymentMethod === 'Cash on Service' ? null : Date.now(),
  });

  await payment.save();

  if (paymentMethod === 'Online Payment') {
    booking.paymentStatus = 'Paid';
    await booking.save();
  }

  res.status(201).json({
    success: true,
    message: 'Payment recorded successfully',
    payment,
  });
});

export const getPaymentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const payment = await Payment.findById(id).populate('bookingId');

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found',
    });
  }

  res.status(200).json({
    success: true,
    payment,
  });
});

export const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ customerId: req.user.id })
    .populate('bookingId', 'bookingId serviceName date status')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: payments.length,
    payments,
  });
});

export const getAllPayments = asyncHandler(async (req, res) => {
  const { status } = req.query;

  let filter = {};

  if (status) {
    filter.status = status;
  }

  const payments = await Payment.find(filter)
    .populate('customerId', 'name email')
    .populate('bookingId', 'bookingId serviceName amount')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: payments.length,
    payments,
  });
});

export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Pending', 'Paid', 'Failed', 'Refunded'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status',
    });
  }

  const payment = await Payment.findByIdAndUpdate(
    id,
    {
      status,
      paymentDate: status === 'Paid' ? Date.now() : payment?.paymentDate,
      updatedAt: Date.now(),
    },
    { new: true }
  );

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found',
    });
  }

  // Update booking payment status
  const booking = await Booking.findById(payment.bookingId);
  if (booking) {
    booking.paymentStatus = status;
    await booking.save();
  }

  res.status(200).json({
    success: true,
    message: 'Payment status updated',
    payment,
  });
});

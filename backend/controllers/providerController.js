import Provider from '../models/Provider.js';
import Booking from '../models/Booking.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createProviderProfile = asyncHandler(async (req, res) => {
  const {
    serviceCategory,
    experience,
    specialization,
    location,
    serviceLocations,
    availability,
  } = req.body;

  if (!serviceCategory || !location) {
    return res.status(400).json({
      success: false,
      message: 'Service category and location are required',
    });
  }

  // Check if provider already exists
  const existingProvider = await Provider.findOne({ userId: req.user.id });
  if (existingProvider) {
    return res.status(400).json({
      success: false,
      message: 'You already have a provider profile',
    });
  }

  const provider = new Provider({
    userId: req.user.id,
    serviceCategory,
    experience,
    specialization,
    location,
    serviceLocations: serviceLocations || [location],
    availability,
  });

  await provider.save();

  res.status(201).json({
    success: true,
    message: 'Provider profile created successfully',
    provider,
  });
});

export const getProviderProfile = asyncHandler(async (req, res) => {
  const provider = await Provider.findOne({ userId: req.user.id });

  if (!provider) {
    return res.status(404).json({
      success: false,
      message: 'Provider profile not found',
    });
  }

  res.status(200).json({
    success: true,
    provider,
  });
});

export const getProviderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const provider = await Provider.findById(id).populate('userId', 'name phone email profilePhoto');

  if (!provider) {
    return res.status(404).json({
      success: false,
      message: 'Provider not found',
    });
  }

  res.status(200).json({
    success: true,
    provider,
  });
});

export const updateProviderProfile = asyncHandler(async (req, res) => {
  const {
    experience,
    specialization,
    location,
    serviceLocations,
    availability,
    bankDetails,
  } = req.body;

  const provider = await Provider.findOneAndUpdate(
    { userId: req.user.id },
    {
      experience,
      specialization,
      location,
      serviceLocations,
      availability,
      bankDetails,
      updatedAt: Date.now(),
    },
    { new: true, runValidators: true }
  );

  if (!provider) {
    return res.status(404).json({
      success: false,
      message: 'Provider profile not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Provider profile updated successfully',
    provider,
  });
});

export const getProviderBookings = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const provider = await Provider.findOne({ userId: req.user.id });

  if (!provider) {
    return res.status(404).json({
      success: false,
      message: 'Provider profile not found',
    });
  }

  let filter = { providerId: provider._id };

  if (status) {
    filter.status = status;
  }

  const bookings = await Booking.find(filter)
    .populate('customerId', 'name phone email address')
    .populate('serviceId', 'name category')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  });
});

export const acceptBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  const provider = await Provider.findOne({ userId: req.user.id });

  if (!provider) {
    return res.status(404).json({
      success: false,
      message: 'Provider profile not found',
    });
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  if (booking.status !== 'Pending' && booking.status !== 'Confirmed') {
    return res.status(400).json({
      success: false,
      message: 'Booking cannot be accepted in current status',
    });
  }

  booking.providerId = provider._id;
  booking.status = 'Provider Assigned';

  await booking.save();

  res.status(200).json({
    success: true,
    message: 'Booking accepted successfully',
    booking,
  });
});

export const rejectBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  booking.providerId = null;
  booking.status = 'Pending';

  await booking.save();

  res.status(200).json({
    success: true,
    message: 'Booking rejected',
    booking,
  });
});

export const getAllProviders = asyncHandler(async (req, res) => {
  const { serviceCategory, location } = req.query;

  let filter = { isActive: true, isVerified: true };

  if (serviceCategory) {
    filter.serviceCategory = serviceCategory;
  }

  if (location) {
    filter.location = location;
  }

  const providers = await Provider.find(filter)
    .populate('userId', 'name phone email profilePhoto')
    .sort({ rating: -1 });

  res.status(200).json({
    success: true,
    count: providers.length,
    providers,
  });
});

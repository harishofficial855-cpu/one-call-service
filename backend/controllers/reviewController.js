import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Provider from '../models/Provider.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  if (!bookingId || !rating) {
    return res.status(400).json({
      success: false,
      message: 'Booking ID and rating are required',
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5',
    });
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  if (booking.status !== 'Completed') {
    return res.status(400).json({
      success: false,
      message: 'Can only review completed bookings',
    });
  }

  // Check if review already exists
  const existingReview = await Review.findOne({ bookingId });
  if (existingReview) {
    return res.status(400).json({
      success: false,
      message: 'Review already exists for this booking',
    });
  }

  const review = new Review({
    bookingId,
    customerId: req.user.id,
    providerId: booking.providerId,
    serviceId: booking.serviceId,
    rating,
    comment,
  });

  await review.save();

  // Update booking review
  booking.rating = rating;
  booking.review = comment;
  await booking.save();

  // Update service rating
  const reviews = await Review.find({ serviceId: booking.serviceId });
  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await Service.findByIdAndUpdate(booking.serviceId, {
    rating: avgRating,
    reviewCount: reviews.length,
  });

  // Update provider rating
  const providerReviews = await Review.find({
    providerId: booking.providerId,
  });
  const providerAvgRating =
    providerReviews.reduce((sum, r) => sum + r.rating, 0) /
    providerReviews.length;

  await Provider.findByIdAndUpdate(booking.providerId, {
    rating: providerAvgRating,
    reviewCount: providerReviews.length,
  });

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    review,
  });
});

export const getReviewsByService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;

  const reviews = await Review.find({
    serviceId,
    isApproved: true,
  })
    .populate('customerId', 'name profilePhoto')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

export const getReviewsByProvider = asyncHandler(async (req, res) => {
  const { providerId } = req.params;

  const reviews = await Review.find({
    providerId,
    isApproved: true,
  })
    .populate('customerId', 'name profilePhoto')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate('customerId', 'name')
    .populate('serviceId', 'name')
    .populate('providerId', 'name')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

export const approveReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findByIdAndUpdate(
    id,
    { isApproved: true },
    { new: true }
  );

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Review approved',
    review,
  });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findByIdAndDelete(id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Review deleted',
  });
});

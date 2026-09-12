import Offer from '../models/Offer.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getAllOffers = asyncHandler(async (req, res) => {
  const offers = await Offer.find({ isActive: true })
    .populate('serviceIds', 'name category')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: offers.length,
    offers,
  });
});

export const getOfferById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const offer = await Offer.findById(id).populate('serviceIds', 'name category');

  if (!offer) {
    return res.status(404).json({
      success: false,
      message: 'Offer not found',
    });
  }

  res.status(200).json({
    success: true,
    offer,
  });
});

export const createOffer = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    discountType = 'percentage',
    discountValue,
    maxDiscount,
    minAmount,
    serviceIds = [],
    applicableLocations = [],
    code,
    startDate,
    endDate,
    usageLimit,
  } = req.body;

  if (!title || !discountValue) {
    return res.status(400).json({
      success: false,
      message: 'Title and discount value are required',
    });
  }

  const offer = new Offer({
    title,
    description,
    discountType,
    discountValue,
    maxDiscount,
    minAmount,
    serviceIds,
    applicableLocations,
    code,
    startDate,
    endDate,
    usageLimit,
  });

  await offer.save();

  res.status(201).json({
    success: true,
    message: 'Offer created successfully',
    offer,
  });
});

export const updateOffer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    discountType,
    discountValue,
    maxDiscount,
    minAmount,
    serviceIds,
    applicableLocations,
    code,
    isActive,
    startDate,
    endDate,
    usageLimit,
  } = req.body;

  const offer = await Offer.findByIdAndUpdate(
    id,
    {
      title,
      description,
      discountType,
      discountValue,
      maxDiscount,
      minAmount,
      serviceIds,
      applicableLocations,
      code,
      isActive,
      startDate,
      endDate,
      usageLimit,
      updatedAt: Date.now(),
    },
    { new: true, runValidators: true }
  );

  if (!offer) {
    return res.status(404).json({
      success: false,
      message: 'Offer not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Offer updated successfully',
    offer,
  });
});

export const deleteOffer = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const offer = await Offer.findByIdAndDelete(id);

  if (!offer) {
    return res.status(404).json({
      success: false,
      message: 'Offer not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Offer deleted successfully',
  });
});

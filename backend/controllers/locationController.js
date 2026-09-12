import Location from '../models/Location.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getAllLocations = asyncHandler(async (req, res) => {
  const locations = await Location.find({ isActive: true }).sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: locations.length,
    locations,
  });
});

export const getLocationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const location = await Location.findById(id);

  if (!location) {
    return res.status(404).json({
      success: false,
      message: 'Location not found',
    });
  }

  res.status(200).json({
    success: true,
    location,
  });
});

export const createLocation = asyncHandler(async (req, res) => {
  const { name, city, state, pincode, latitude, longitude } = req.body;

  if (!name || !city) {
    return res.status(400).json({
      success: false,
      message: 'Name and city are required',
    });
  }

  const location = new Location({
    name,
    city,
    state,
    pincode,
    latitude,
    longitude,
  });

  await location.save();

  res.status(201).json({
    success: true,
    message: 'Location created successfully',
    location,
  });
});

export const updateLocation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, city, state, pincode, latitude, longitude, isActive } = req.body;

  const location = await Location.findByIdAndUpdate(
    id,
    {
      name,
      city,
      state,
      pincode,
      latitude,
      longitude,
      isActive,
      updatedAt: Date.now(),
    },
    { new: true, runValidators: true }
  );

  if (!location) {
    return res.status(404).json({
      success: false,
      message: 'Location not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Location updated successfully',
    location,
  });
});

export const deleteLocation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const location = await Location.findByIdAndDelete(id);

  if (!location) {
    return res.status(404).json({
      success: false,
      message: 'Location not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Location deleted successfully',
  });
});

import Service from '../models/Service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getAllServices = asyncHandler(async (req, res) => {
  const { category, search } = req.query;

  let filter = { isActive: true };

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  const services = await Service.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: services.length,
    services,
  });
});

export const getServiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const service = await Service.findById(id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found',
    });
  }

  res.status(200).json({
    success: true,
    service,
  });
});

export const createService = asyncHandler(async (req, res) => {
  const { name, category, description, subservices, basePrice, image, estimatedTime } = req.body;

  if (!name || !category || !basePrice) {
    return res.status(400).json({
      success: false,
      message: 'Name, category, and price are required',
    });
  }

  const service = new Service({
    name,
    category,
    description,
    subservices,
    basePrice,
    image,
    estimatedTime,
  });

  await service.save();

  res.status(201).json({
    success: true,
    message: 'Service created successfully',
    service,
  });
});

export const updateService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, subservices, basePrice, image, isActive, estimatedTime } = req.body;

  const service = await Service.findByIdAndUpdate(
    id,
    {
      name,
      description,
      subservices,
      basePrice,
      image,
      isActive,
      estimatedTime,
      updatedAt: Date.now(),
    },
    { new: true, runValidators: true }
  );

  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Service updated successfully',
    service,
  });
});

export const deleteService = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const service = await Service.findByIdAndDelete(id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Service deleted successfully',
  });
});

export const getServiceCategories = asyncHandler(async (req, res) => {
  const categories = [
    'Plumber',
    'House Cleaning',
    'Water Tank Cleaning',
    'Electrical Services',
    'Haircut',
    'Mutton Cutter',
    "Women's Haircut",
  ];

  res.status(200).json({
    success: true,
    categories,
  });
});

import Service, { SERVICE_CATEGORIES } from '../models/Service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getAllServices = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const filter = { isActive: true };

  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
      { providerName: { $regex: search, $options: 'i' } },
      { serviceLocation: { $regex: search, $options: 'i' } },
    ];
  }

  const services = await Service.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: services.length, services });
});

export const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  res.status(200).json({ success: true, service });
});

// Public registration — any authenticated user (provider) or admin can create
export const createService = asyncHandler(async (req, res) => {
  const {
    name, category, description, basePrice, image, estimatedTime,
    providerName, phone, experience, serviceLocation, address,
    availableTime, profilePhoto,
    // legacy admin fields
    subservices,
  } = req.body;

  // Validation
  if (!name || !category || !basePrice) {
    return res.status(400).json({ success: false, message: 'Name, category, and price are required' });
  }
  if (!SERVICE_CATEGORIES.includes(category)) {
    return res.status(400).json({ success: false, message: 'Invalid service category' });
  }
  if (isNaN(Number(basePrice)) || Number(basePrice) < 0) {
    return res.status(400).json({ success: false, message: 'Price must be a valid positive number' });
  }
  if (phone && !/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) {
    return res.status(400).json({ success: false, message: 'Enter a valid 10-digit mobile number' });
  }

  const service = await Service.create({
    name, category, description,
    basePrice: Number(basePrice),
    image: image || profilePhoto || '',
    estimatedTime: estimatedTime || availableTime || '',
    providerName: providerName || '',
    phone: phone || '',
    experience: experience || '',
    serviceLocation: serviceLocation || '',
    address: address || '',
    availableTime: availableTime || '',
    profilePhoto: profilePhoto || '',
    createdBy: req.user?.id || null,
  });

  res.status(201).json({ success: true, message: 'Service registered successfully', service });
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedAt: Date.now() },
    { new: true, runValidators: true }
  );
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  res.status(200).json({ success: true, message: 'Service updated successfully', service });
});

export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  res.status(200).json({ success: true, message: 'Service deleted successfully' });
});

export const getServiceCategories = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, categories: SERVICE_CATEGORIES });
});

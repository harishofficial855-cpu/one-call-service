import Complaint from '../models/Complaint.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createComplaint = asyncHandler(async (req, res) => {
  const { bookingId, title, description, category = 'Other' } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: 'Title and description are required',
    });
  }

  const complaint = new Complaint({
    customerId: req.user.id,
    bookingId,
    title,
    description,
    category,
  });

  await complaint.save();

  res.status(201).json({
    success: true,
    message: 'Complaint created successfully',
    complaintId: complaint.complaintId,
    complaint,
  });
});

export const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ customerId: req.user.id })
    .populate('bookingId', 'bookingId serviceName')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: complaints.length,
    complaints,
  });
});

export const getComplaintById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const complaint = await Complaint.findById(id)
    .populate('customerId', 'name email phone')
    .populate('bookingId', 'bookingId serviceName');

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found',
    });
  }

  res.status(200).json({
    success: true,
    complaint,
  });
});

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, resolution } = req.body;

  const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status',
    });
  }

  const complaint = await Complaint.findByIdAndUpdate(
    id,
    {
      status,
      resolution: resolution || complaint?.resolution,
      resolvedAt: status === 'Resolved' ? Date.now() : null,
      updatedAt: Date.now(),
    },
    { new: true }
  );

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Complaint status updated',
    complaint,
  });
});

export const addReply = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message, attachments = [] } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: 'Reply message is required',
    });
  }

  const complaint = await Complaint.findByIdAndUpdate(
    id,
    {
      $push: {
        replies: {
          user: req.user.id,
          role: req.user.role,
          message,
          attachments,
        },
      },
      updatedAt: Date.now(),
    },
    { new: true }
  );

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Reply added successfully',
    complaint,
  });
});

export const getAllComplaints = asyncHandler(async (req, res) => {
  const { status, category } = req.query;

  let filter = {};

  if (status) {
    filter.status = status;
  }

  if (category) {
    filter.category = category;
  }

  const complaints = await Complaint.find(filter)
    .populate('customerId', 'name email phone')
    .populate('bookingId', 'bookingId serviceName')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: complaints.length,
    complaints,
  });
});

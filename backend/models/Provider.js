import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceCategory: {
      type: String,
      enum: [
        'Plumber',
        'House Cleaning',
        'Water Tank Cleaning',
        'Electrical Services',
        'Haircut',
        'Mutton Cutter',
        "Women's Haircut",
      ],
      required: true,
    },
    experience: String,
    specialization: [String],
    location: {
      type: String,
      required: true,
    },
    serviceLocations: [String],
    availability: {
      monday: { start: String, end: String },
      tuesday: { start: String, end: String },
      wednesday: { start: String, end: String },
      thursday: { start: String, end: String },
      friday: { start: String, end: String },
      saturday: { start: String, end: String },
      sunday: { start: String, end: String },
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    completedJobs: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    bankDetails: {
      accountNumber: String,
      ifsc: String,
      accountHolderName: String,
    },
    documents: {
      aadhar: String,
      pan: String,
      license: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Provider', providerSchema);

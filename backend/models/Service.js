import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide service name'],
      trim: true,
    },
    category: {
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
    description: String,
    subservices: [String],
    basePrice: {
      type: Number,
      required: true,
    },
    image: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    estimatedTime: {
      type: String,
      default: '30-60 minutes',
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

export default mongoose.model('Service', serviceSchema);

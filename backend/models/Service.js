import mongoose from 'mongoose';

const SERVICE_CATEGORIES = [
  'Haircut', 'Women Haircut', 'Plumber', 'Electrician',
  'Water Tank Cleaning', 'House Cleaning', 'Reels / Event Video Shoot',
  'Chef', 'Security', 'Water Can', 'Tent Service',
  'Goat Cutter', 'Chicken Cutter', 'Yoga & Diet Teacher',
  'Nurse', 'Physiotherapy', 'Food Diet Teacher', 'Caretaker', 'Other',
];

const serviceSchema = new mongoose.Schema(
  {
    // Core service info
    name: { type: String, required: [true, 'Service name is required'], trim: true },
    category: { type: String, required: [true, 'Category is required'], enum: SERVICE_CATEGORIES },
    description: { type: String, maxlength: [9000, 'Description cannot exceed 9000 characters'] },
    basePrice: { type: Number, required: [true, 'Price is required'], min: 0 },
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    estimatedTime: { type: String, default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },

    // Provider info (set when a provider registers)
    providerName: { type: String, default: '' },
    phone: { type: String, default: '' },
    experience: { type: String, default: '' },
    serviceLocation: { type: String, default: '' },
    address: { type: String, default: '' },
    availableTime: { type: String, default: '' },
    profilePhoto: { type: String, default: '' },

    // Link to user account if registered via auth
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

export { SERVICE_CATEGORIES };
export default mongoose.model('Service', serviceSchema);

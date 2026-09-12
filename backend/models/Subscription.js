import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    planName: {
      type: String,
      default: 'ONE CALL SERVICE SUBSCRIPTION',
    },
    price: {
      type: Number,
      default: 549,
    },
    benefits: {
      type: [String],
      default: [
        'Priority booking',
        'Special service discounts',
        'Member-only offers',
        'Faster support',
        'Exclusive deals',
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000),
    },
    transactionId: String,
    renewalDate: Date,
    autoRenew: {
      type: Boolean,
      default: false,
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

export default mongoose.model('Subscription', subscriptionSchema);

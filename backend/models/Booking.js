import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
      default: null,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    serviceName: String,
    category: String,
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    location: {
      street: String,
      area: String,
      city: String,
      pincode: String,
      landmark: String,
    },
    customerDetails: {
      fullName: String,
      phone: String,
      email: String,
    },
    serviceAmount: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    instructions: String,
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Provider Assigned', 'On The Way', 'Service Started', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['Cash on Service', 'Online Payment'],
      default: 'Cash on Service',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    review: String,
    cancelReason: String,
    completedAt: Date,
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

// Auto-generate booking ID
bookingSchema.pre('save', async function (next) {
  if (this.isNew && !this.bookingId) {
    const count = await mongoose.model('Booking').countDocuments();
    const year = new Date().getFullYear();
    this.bookingId = `OCS-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

export default mongoose.model('Booking', bookingSchema);

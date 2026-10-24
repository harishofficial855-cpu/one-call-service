import mongoose from 'mongoose';

const trackingEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
    },
    eventType: {
      type: String,
      enum: ['page_view', 'provider_click'],
      required: true,
    },
    action: {
      type: String,
      enum: ['call', 'whatsapp'],
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
    pagePath: {
      type: String,
      required: true,
      maxlength: 200,
    },
    occurredAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

trackingEventSchema.index({ occurredAt: -1 });
trackingEventSchema.index({ eventType: 1, occurredAt: -1 });
trackingEventSchema.index({ providerId: 1, action: 1, occurredAt: -1 });

export default mongoose.model('TrackingEvent', trackingEventSchema);

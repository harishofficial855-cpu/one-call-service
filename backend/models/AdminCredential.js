import mongoose from 'mongoose';

const adminCredentialSchema = new mongoose.Schema(
  {
    _id: { type: String, default: 'admin' },
    passwordHash: { type: String, required: true },
    resetCodeHash: { type: String, default: null },
    resetCodeExpiresAt: { type: Date, default: null },
    resetCodeAttempts: { type: Number, default: 0 },
    resetRequestedAt: { type: Date, default: null },
    resetRequestWindowStartedAt: { type: Date, default: null },
    resetRequestCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('AdminCredential', adminCredentialSchema);

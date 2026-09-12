import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { errorMiddleware } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import providerRoutes from './routes/providerRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();

// Connect DB (cached for serverless)
connectDB();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorMiddleware);

// Only listen when running locally (not on Vercel serverless)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✓ Server is running on port ${PORT}`);
    console.log(`✓ API URL: http://localhost:${PORT}/api`);
    console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
  });
}

export default app;

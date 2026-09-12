import express from 'express';
import {
  createBooking,
  getBookingById,
  getMyBookings,
  updateBookingStatus,
  cancelBooking,
  getAllBookings,
} from '../controllers/bookingController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, createBooking);
router.get('/my-bookings', authMiddleware, getMyBookings);
router.get('/:id', authMiddleware, getBookingById);
router.put('/:id/status', authMiddleware, updateBookingStatus);
router.put('/:id/cancel', authMiddleware, cancelBooking);
router.get('/', authMiddleware, roleMiddleware('admin'), getAllBookings);

export default router;

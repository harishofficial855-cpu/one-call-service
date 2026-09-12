import express from 'express';
import {
  createProviderProfile,
  getProviderProfile,
  getProviderById,
  updateProviderProfile,
  getProviderBookings,
  acceptBooking,
  rejectBooking,
  getAllProviders,
} from '../controllers/providerController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('provider'), createProviderProfile);
router.get('/profile', authMiddleware, roleMiddleware('provider'), getProviderProfile);
router.get('/bookings', authMiddleware, roleMiddleware('provider'), getProviderBookings);
router.post('/bookings/accept', authMiddleware, roleMiddleware('provider'), acceptBooking);
router.post('/bookings/reject', authMiddleware, roleMiddleware('provider'), rejectBooking);
router.get('/', getAllProviders);
router.get('/:id', getProviderById);
router.put('/', authMiddleware, roleMiddleware('provider'), updateProviderProfile);

export default router;

import express from 'express';
import {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
} from '../controllers/locationController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllLocations);
router.get('/:id', getLocationById);
router.post('/', authMiddleware, roleMiddleware('admin'), createLocation);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateLocation);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteLocation);

export default router;

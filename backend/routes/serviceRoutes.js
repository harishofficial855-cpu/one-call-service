import express from 'express';
import {
  getAllServices, getServiceById, createService,
  updateService, deleteService, getServiceCategories,
} from '../controllers/serviceController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllServices);
router.get('/categories', getServiceCategories);
router.get('/:id', getServiceById);

// Any logged-in user can register a service (provider or admin)
router.post('/', authMiddleware, createService);

// Only admin can update or delete
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateService);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteService);

export default router;

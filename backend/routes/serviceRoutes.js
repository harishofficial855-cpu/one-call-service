import express from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServiceCategories,
} from '../controllers/serviceController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllServices);
router.get('/categories', getServiceCategories);
router.get('/:id', getServiceById);
router.post('/', authMiddleware, roleMiddleware('admin'), createService);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateService);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteService);

export default router;

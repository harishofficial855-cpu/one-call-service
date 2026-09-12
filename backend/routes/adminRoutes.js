import express from 'express';
import {
  getDashboardStats,
  getAllCustomers,
  getCustomerById,
  getAllProviders,
  verifyProvider,
  activateUser,
  deleteUser,
} from '../controllers/adminController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', authMiddleware, roleMiddleware('admin'), getDashboardStats);
router.get('/customers', authMiddleware, roleMiddleware('admin'), getAllCustomers);
router.get('/customers/:id', authMiddleware, roleMiddleware('admin'), getCustomerById);
router.get('/providers', authMiddleware, roleMiddleware('admin'), getAllProviders);
router.put('/providers/:id/verify', authMiddleware, roleMiddleware('admin'), verifyProvider);
router.put('/users/:id/activate', authMiddleware, roleMiddleware('admin'), activateUser);
router.delete('/users/:id', authMiddleware, roleMiddleware('admin'), deleteUser);

export default router;

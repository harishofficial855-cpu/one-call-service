import express from 'express';
import {
  loginAdmin,
  requestAdminPasswordReset,
  resetAdminPassword,
  getDashboardStats,
  getAllCustomers,
  getCustomerById,
  getAllProviders,
  verifyProvider,
  activateUser,
  deleteUser,
} from '../controllers/adminController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';
import { adminLoginRateLimit } from '../middleware/adminLoginRateLimit.js';
import { adminPasswordResetRateLimit } from '../middleware/adminPasswordResetRateLimit.js';
import { getAnalyticsReport } from '../controllers/trackingController.js';

const router = express.Router();

router.post('/login', adminLoginRateLimit, loginAdmin);
router.post('/password-reset/request', adminPasswordResetRateLimit, requestAdminPasswordReset);
router.post('/password-reset/confirm', adminPasswordResetRateLimit, resetAdminPassword);
router.get('/stats', authMiddleware, roleMiddleware('admin'), getDashboardStats);
router.get('/analytics', authMiddleware, roleMiddleware('admin'), getAnalyticsReport);
router.get('/customers', authMiddleware, roleMiddleware('admin'), getAllCustomers);
router.get('/customers/:id', authMiddleware, roleMiddleware('admin'), getCustomerById);
router.get('/providers', authMiddleware, roleMiddleware('admin'), getAllProviders);
router.put('/providers/:id/verify', authMiddleware, roleMiddleware('admin'), verifyProvider);
router.put('/users/:id/activate', authMiddleware, roleMiddleware('admin'), activateUser);
router.delete('/users/:id', authMiddleware, roleMiddleware('admin'), deleteUser);

export default router;

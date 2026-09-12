import express from 'express';
import {
  createPayment,
  getPaymentById,
  getMyPayments,
  getAllPayments,
  updatePaymentStatus,
} from '../controllers/paymentController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, createPayment);
router.get('/my-payments', authMiddleware, getMyPayments);
router.get('/:id', authMiddleware, getPaymentById);
router.get('/', authMiddleware, roleMiddleware('admin'), getAllPayments);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updatePaymentStatus);

export default router;

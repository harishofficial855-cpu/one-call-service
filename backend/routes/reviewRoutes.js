import express from 'express';
import {
  createReview,
  getReviewsByService,
  getReviewsByProvider,
  getAllReviews,
  approveReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, createReview);
router.get('/service/:serviceId', getReviewsByService);
router.get('/provider/:providerId', getReviewsByProvider);
router.get('/', authMiddleware, roleMiddleware('admin'), getAllReviews);
router.put('/:id/approve', authMiddleware, roleMiddleware('admin'), approveReview);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteReview);

export default router;

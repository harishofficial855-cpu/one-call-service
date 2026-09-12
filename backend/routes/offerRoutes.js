import express from 'express';
import {
  getAllOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
} from '../controllers/offerController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllOffers);
router.get('/:id', getOfferById);
router.post('/', authMiddleware, roleMiddleware('admin'), createOffer);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateOffer);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteOffer);

export default router;

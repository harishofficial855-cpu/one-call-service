import express from 'express';
import {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  updateComplaintStatus,
  addReply,
  getAllComplaints,
} from '../controllers/complaintController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, createComplaint);
router.get('/my-complaints', authMiddleware, getMyComplaints);
router.get('/:id', authMiddleware, getComplaintById);
router.put('/:id/status', authMiddleware, roleMiddleware('admin'), updateComplaintStatus);
router.post('/:id/reply', authMiddleware, addReply);
router.get('/', authMiddleware, roleMiddleware('admin'), getAllComplaints);

export default router;

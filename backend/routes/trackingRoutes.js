import express from 'express';
import { createTrackingEvent } from '../controllers/trackingController.js';
import { trackingRateLimit } from '../middleware/trackingRateLimit.js';

const router = express.Router();

router.post('/events', trackingRateLimit, createTrackingEvent);

export default router;

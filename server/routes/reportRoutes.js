import express from 'express';
import reportController from '../controllers/reportController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', authenticate, authorize('admin'), reportController.getReportStats);

export default router;

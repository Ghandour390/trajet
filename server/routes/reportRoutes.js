import express from 'express';
import reportController from '../controllers/reportController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', authenticate, authorize('admin'), reportController.getReportStats);
router.get('/fuel-chart', authenticate, authorize('admin'), reportController.getFuelChartData);
router.get('/kilometrage-chart', authenticate, authorize('admin'), reportController.getKilometrageChartData);

export default router;

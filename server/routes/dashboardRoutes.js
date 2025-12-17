import express from 'express';
import dashboardController from '../controllers/dashboardController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', authenticate, authorize('admin'), dashboardController.getStats);
router.get('/recent-trips', authenticate, authorize('admin'), dashboardController.getRecentTrips);
router.get('/vehicles-attention', authenticate, authorize('admin'), dashboardController.getVehiclesNeedingAttention);
router.get('/fuel-chart', authenticate, authorize('admin'), dashboardController.getFuelChartData);
router.get('/kilometrage-chart', authenticate, authorize('admin'), dashboardController.getKilometrageChartData);

export default router;

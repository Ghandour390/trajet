import express from 'express';
import vehicleController from '../controllers/vihicleController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin only - Gérer les camions
router.post('/', authenticate, authorize('admin'), vehicleController.createVehicle);
router.get('/', authenticate, authorize('admin'), vehicleController.getAllVehicles);
router.get('/:id', authenticate, authorize('admin'), vehicleController.getVehicleById);
router.patch('/:id', authenticate, authorize('admin'), vehicleController.updateVehicle);
router.delete('/:id', authenticate, authorize('admin'), vehicleController.deleteVehicle);

export default router;
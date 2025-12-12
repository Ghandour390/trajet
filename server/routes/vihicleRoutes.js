import express from 'express';
import vehicleController from '../controllers/vihicleController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin only - Gérer les camions
router.post('/', authenticate, authorize('admin'), vehicleController.createVehicle);
router.get('/', authenticate, authorize('admin'), vehicleController.getAllVehicles);

/**
 * @swagger
 * /api/vehicles/disponibles:
 *   get:
 *     summary: Obtenir les véhicules disponibles pour une date
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date au format YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Liste des véhicules disponibles
 *       400:
 *         description: Date manquante
 */
router.get('/disponibles', authenticate, authorize('admin'), vehicleController.getAvailableVehicles);

router.get('/:id', authenticate, authorize('admin'), vehicleController.getVehicleById);
router.patch('/:id', authenticate, authorize('admin'), vehicleController.updateVehicle);
router.delete('/:id', authenticate, authorize('admin'), vehicleController.deleteVehicle);

export default router;
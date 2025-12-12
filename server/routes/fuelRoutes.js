import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import fuelController from '../controllers/fuelController.js';

const router = express.Router();

/**
 * @swagger
 * /api/fuel/stats:
 *   get:
 *     summary: Obtenir les statistiques de carburant
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques récupérées
 */
router.get('/stats', authenticate, authorize('admin'), fuelController.getFuelStats.bind(fuelController));

/**
 * @swagger
 * /api/fuel/trip/{tripId}:
 *   get:
 *     summary: Obtenir les enregistrements de carburant par trajet
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Enregistrements récupérés
 */
router.get('/trip/:tripId', authenticate, fuelController.getFuelByTrip.bind(fuelController));

/**
 * @swagger
 * /api/fuel/consumption/{vehicleId}:
 *   get:
 *     summary: Obtenir la consommation par véhicule
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consommation récupérée
 */
router.get('/consumption/:vehicleId', authenticate, authorize('admin'), fuelController.getConsumptionByVehicle.bind(fuelController));

/**
 * @swagger
 * /api/fuel:
 *   post:
 *     summary: Créer un enregistrement de carburant
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Enregistrement créé
 */
/**
 * @swagger
 * /api/fuel:
 *   get:
 *     summary: Liste des enregistrements de carburant
 *     tags: [Fuel]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste récupérée
 */
router.route('/')
  .post(authenticate, authorize('chauffeur', 'admin'), fuelController.createFuelRecord.bind(fuelController))
  .get(authenticate, authorize('admin'), fuelController.getAllFuelRecords.bind(fuelController));

router.route('/:id')
  .get(authenticate, fuelController.getFuelRecordById.bind(fuelController))
  .put(authenticate, authorize('admin'), fuelController.updateFuelRecord.bind(fuelController))
  .delete(authenticate, authorize('admin'), fuelController.deleteFuelRecord.bind(fuelController));

export default router;

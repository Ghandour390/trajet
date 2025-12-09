import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import maintenanceController from '../controllers/maintenanceController.js';

const router = express.Router();

/**
 * @swagger
 * /api/maintenance:
 *   post:
 *     summary: Définir règles maintenance (Admin)
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Règle créée
 */
/**
 * @swagger
 * /api/maintenance:
 *   get:
 *     summary: Consulter rapports (Admin)
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des maintenances
 */
router.route('/')
  .post(authenticate, authorize('admin'), maintenanceController.create)
  .get(authenticate, authorize('admin'), maintenanceController.getAll);

router.route('/:id')
  .get(authenticate, authorize('admin'), maintenanceController.getById)
  .patch(authenticate, authorize('admin'), maintenanceController.update)
  .delete(authenticate, authorize('admin'), maintenanceController.delete);

export default router;

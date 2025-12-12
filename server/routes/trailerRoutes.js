import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import trailerController from '../controllers/trailerController.js';

const router = express.Router();

/**
 * @swagger
 * /api/trailers:
 *   post:
 *     summary: Créer une remorque (Admin)
 *     tags: [Trailers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Remorque créée
 */
/**
 * @swagger
 * /api/trailers:
 *   get:
 *     summary: Liste des remorques (Admin)
 *     tags: [Trailers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des remorques
 */
router.route('/')
  .post(authenticate, authorize('admin'), trailerController.createTrailer.bind(trailerController))
  .get(authenticate, authorize('admin'), trailerController.getAllTrailers.bind(trailerController));

/**
 * @swagger
 * /api/trailers/disponibles:
 *   get:
 *     summary: Obtenir les remorques disponibles pour une période
 *     tags: [Trailers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startAt
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endAt
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Liste des remorques disponibles
 */
router.get('/disponibles', authenticate, authorize('admin'), trailerController.getAvailableTrailers.bind(trailerController));

router.route('/:id')
  .get(authenticate, authorize('admin'), trailerController.getTrailerById.bind(trailerController))
  .patch(authenticate, authorize('admin'), trailerController.updateTrailer.bind(trailerController))
  .delete(authenticate, authorize('admin'), trailerController.deleteTrailer.bind(trailerController));

export default router;

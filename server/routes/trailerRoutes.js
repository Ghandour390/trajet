import express from 'express';
import trailerController from '../controllers/trailerController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin only - Gérer les remorques
router.post('/', authenticate, authorize('admin'), trailerController.createTrailer);
router.get('/', authenticate, authorize('admin'), trailerController.getAllTrailers);

/**
 * @swagger
 * /api/trailers/disponibles:
 *   get:
 *     summary: Obtenir les remorques disponibles pour une date
 *     tags: [Trailers]
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
 *         description: Liste des remorques disponibles
 *       400:
 *         description: Date manquante
 */
router.get('/disponibles', authenticate, authorize('admin'), trailerController.getAvailableTrailers);

router.get('/:id/tires', authenticate, authorize('admin'), trailerController.getTrailerWithTires);
router.get('/:id', authenticate, authorize('admin'), trailerController.getTrailerById);
router.patch('/:id', authenticate, authorize('admin'), trailerController.updateTrailer);
router.delete('/:id', authenticate, authorize('admin'), trailerController.deleteTrailer);

export default router;

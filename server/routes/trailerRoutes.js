import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

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
  .post(authenticate, authorize('admin'))
  .get(authenticate, authorize('admin'));

router.route('/:id')
  .get(authenticate, authorize('admin'))
  .patch(authenticate, authorize('admin'))
  .delete(authenticate, authorize('admin'));

export default router;

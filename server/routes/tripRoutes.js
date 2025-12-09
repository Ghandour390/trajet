import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Créer un trajet (Admin)
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Trajet créé
 */
/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Liste des trajets (Admin & Chauffeur)
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des trajets
 */
router.route('/')
  .post(authenticate, authorize('admin'))
  .get(authenticate, authorize('admin', 'chauffeur'));

/**
 * @swagger
 * /api/trips/{id}/status:
 *   patch:
 *     summary: Mettre à jour le statut (Chauffeur)
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statut mis à jour
 */
router.patch('/:id/status', authenticate, authorize('chauffeur'));

/**
 * @swagger
 * /api/trips/{id}/mileage:
 *   patch:
 *     summary: Saisir kilométrage (Chauffeur)
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kilométrage enregistré
 */
router.patch('/:id/mileage', authenticate, authorize('chauffeur'));

/**
 * @swagger
 * /api/trips/{id}/fuel:
 *   patch:
 *     summary: Saisir gasoil (Chauffeur)
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Gasoil enregistré
 */
router.patch('/:id/fuel', authenticate, authorize('chauffeur'));

/**
 * @swagger
 * /api/trips/{id}/remarks:
 *   patch:
 *     summary: Ajouter remarques (Chauffeur)
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Remarques ajoutées
 */
router.patch('/:id/remarks', authenticate, authorize('chauffeur'));

router.route('/:id')
  .get(authenticate, authorize('admin', 'chauffeur'))
  .patch(authenticate, authorize('admin'))
  .delete(authenticate, authorize('admin'));

export default router;

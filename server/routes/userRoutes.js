import express from 'express';
import userController from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import upload, { handleUploadError } from '../middleware/uploadValidation.js';

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Liste tous les utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *       401:
 *         description: Non authentifié
 */
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Créer un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Utilisateur créé
 */
router.route('/')
  .get(authenticate, authorize('admin'), userController.getAllUsers.bind(userController))
  .post(authenticate, authorize('admin'), userController.createUser.bind(userController));

/**
 * @swagger
 * /api/users/disponibles:
 *   get:
 *     summary: Obtenir les chauffeurs disponibles pour une date
 *     tags: [Users]
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
 *         description: Liste des chauffeurs disponibles
 *       400:
 *         description: Date manquante
 */
router.get('/disponibles', authenticate, authorize('admin'), userController.getAvailableChauffeurs.bind(userController));

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtenir un utilisateur par ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       404:
 *         description: Utilisateur non trouvé
 */
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 */
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 */
router.route('/:id')
  .get(authenticate, authorize('admin'), userController.getUserById.bind(userController));

router.route('/:id')
  .patch(authenticate, userController.updateUser.bind(userController))
  .delete(authenticate, authorize('admin'), userController.deleteUser.bind(userController));

/**
 * @swagger
 * /api/users/{id}/profile-image:
 *   post:
 *     summary: Upload image de profil
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploadée avec succès
 *       400:
 *         description: Fichier invalide
 *       404:
 *         description: Utilisateur non trouvé
 */
router.post(
  '/:id/profile-image', 
  authenticate,
  upload.single('image'), 
  handleUploadError,
  userController.uploadProfileImage.bind(userController)
);

export default router;

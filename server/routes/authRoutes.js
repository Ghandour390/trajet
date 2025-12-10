import authController from "../controllers/authController.js";
import express from "express";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       400:
 *         description: Erreur de validation
 */
// router.post("/register", authController.register.bind(authController));
router.post("/register", authController.register.bind((res, req)=>{return res.json("hello world", req.body)}));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Identifiants invalides
 */
router.post("/login", authController.login.bind(authController));

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnexion utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *       400:
 *         description: Token invalide
 */
router.post("/logout", authController.logout.bind(authController));

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Renouveler l'access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token renouvelé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Token invalide
 */
router.post("/refresh", authController.refreshToken.bind(authController));

/**
 * @swagger
 * /api/auth/my:
 *  get:
 *    summary: Récupérer les informations de l'utilisateur connecté
 *   tags: [Auth]
 *   security:
 *     - bearerAuth: []
 *   responses:
 *    200:
 *     description: Informations de l'utilisateur récupérées avec succès
 *    content:
 *      application/json:
 *       schema:
 *        type: object
 *   properties:
 *      id:
 *       type: string
 *     firstname:
 *      type: string
 *    lastname:
 *    type: string
 *   email:
 *    type: string
 *  role:
 *   type: string
 *      500:
 *    description: Erreur serveur
 */
router.get("/my",authenticate, authController.my.bind(authController));

/**
 * @swagger
 * /api/auth/change-password:   
 *  post:
 *   summary: Changer le mot de passe de l'utilisateur connecté
 *  tags: [Auth]
 *  security:
 *   - bearerAuth: []
 *  requestBody:
 *    required: true
 *   content:
 *    application/json:
 *     schema:
 *      type: object
 *     required:
 *      - currentPassword
 *     - newPassword
 *    properties:
 *     currentPassword:
 *     type: string
 *    newPassword:
 *    type: string
 *  responses:
 *   200:
 *   description: Mot de passe changé avec succès
 *  400:
 *  description: Erreur lors du changement de mot de passe
 * 500:
 *  description: Erreur serveur
 */
router.post("/change-password", authenticate, authController.changePassword.bind(authController));  
export default router;



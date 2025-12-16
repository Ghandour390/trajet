import userService from '../services/userService.js';
import { uploadToMinio } from '../config/minio.js';

class UserController {
  // @desc    Get all users
  // @route   GET /api/users
  async getAllUsers(req, res) {
    try {
      const users = await userService.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  // @desc    Get user by ID
  // @route   GET /api/users/:id
  async getUserById(req, res) {
    try {
      const user = await userService.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  // @desc    Create new user
  // @route   POST /api/users
  async createUser(req, res) {
    try {
      const user = await userService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  // @desc    Update user
  // @route   PUT /api/users/:id
  async updateUser(req, res) {
    try {
      const user = await userService.update(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  // @desc    Delete user
  // @route   DELETE /api/users/:id
  async deleteUser(req, res) {
    try {
      const user = await userService.delete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  // @desc    Get trips for chauffeurs
  // @route   GET /api/users/trips
  async getMyTrips(req, res) {
    try {
      const trips = await userService.getMyTrips();
      res.status(200).json(trips);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // @desc    Get available chauffeurs for a date
  // @route   GET /api/users/disponibles?startAt=YYYY-MM-DD&endAt=YYYY-MM-DD
  async getAvailableChauffeurs(req, res) {
    try {
      const { startAt, endAt } = req.query;
      if (!startAt) {
        return res.status(400).json({ message: 'startAt est obligatoire' });
      }
      const chauffeurs = await userService.findAvailableChauffeurs(startAt, endAt);
      res.status(200).json(chauffeurs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // @desc    Upload profile image
  // @route   POST /api/users/:id/profile-image
  async uploadProfileImage(req, res) {
    try {
      // Vérifier si un fichier est fourni
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          message: 'Aucune image fournie' 
        });
      }

      // Vérifier si l'utilisateur existe
      const userExists = await userService.findById(req.params.id);
      if (!userExists) {
        return res.status(404).json({ 
          success: false,
          message: 'Utilisateur introuvable' 
        });
      }
      
      // Upload du fichier vers MinIO
      const imageUrl = await uploadToMinio(req.file, 'profiles');
      
      // Mise à jour de l'utilisateur avec l'URL de l'image
      const user = await userService.update(req.params.id, { profileImage: imageUrl });
      
      res.status(200).json({ 
        success: true,
        message: 'Image de profil mise à jour avec succès',
        data: {
          profileImage: imageUrl,
          user
        }
      });
    } catch (error) {
      console.error('Erreur upload image profil:', error);
      
      // Gestion des erreurs spécifiques
      if (error.message.includes('MinIO') || error.message.includes('upload')) {
        return res.status(503).json({ 
          success: false,
          message: 'Service de stockage temporairement indisponible',
          error: error.message
        });
      }
      
      res.status(500).json({ 
        success: false,
        message: 'Erreur lors de l\'upload de l\'image',
        error: error.message 
      });
    }
  }
}

export default new UserController();
  
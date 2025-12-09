import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import tireController from '../controllers/tireController.js';

const router = express.Router();

// TRAJ-46: CRUD Tire
router.route('/')
  .post(authenticate, authorize('admin'), tireController.createTire.bind(tireController))
  .get(authenticate, authorize('admin'), tireController.getAllTires.bind(tireController));

router.route('/:id')
  .get(authenticate, authorize('admin'), tireController.getTireById.bind(tireController))
  .patch(authenticate, authorize('admin'), tireController.updateTire.bind(tireController))
  .delete(authenticate, authorize('admin'), tireController.deleteTire.bind(tireController));

// TRAJ-48: Link tires to vehicles
router.post('/:id/link', authenticate, authorize('admin'), tireController.linkTireToVehicle.bind(tireController));

export default router;

import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import tireController from '../controllers/tireController.js';

const router = express.Router();

router.get('/attention', authenticate, authorize('admin'), tireController.getTiresNeedingAttention.bind(tireController));
router.get('/alerts', authenticate, authorize('admin'), tireController.getAlerts.bind(tireController));

router.route('/')
  .post(authenticate, authorize('admin'), tireController.createTire.bind(tireController))
  .get(authenticate, authorize('admin'), tireController.getAllTires.bind(tireController));

router.route('/:id')
  .get(authenticate, authorize('admin'), tireController.getTireById.bind(tireController))
  .patch(authenticate, authorize('admin'), tireController.updateTire.bind(tireController))
  .delete(authenticate, authorize('admin'), tireController.deleteTire.bind(tireController));

router.post('/:id/link', authenticate, authorize('admin'), tireController.linkTireToVehicle.bind(tireController));
router.post('/:id/inspection', authenticate, tireController.addInspection.bind(tireController));
router.post('/:id/rotate', authenticate, authorize('admin'), tireController.rotateTire.bind(tireController));
router.put('/alerts/:id/resolve', authenticate, authorize('admin'), tireController.resolveAlert.bind(tireController));

export default router;

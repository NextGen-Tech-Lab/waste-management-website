import express from 'express';
import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicleLocation,
  updateVehicleStatus,
  getVehicleAnalytics,
} from '../controllers/vehicleController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { apiLimiter, createLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', apiLimiter, authenticate, getAllVehicles);
router.get('/analytics', authenticate, authorize('admin'), getVehicleAnalytics);
router.get('/:id', apiLimiter, authenticate, getVehicleById);
router.post('/', createLimiter, authenticate, authorize('admin'), createVehicle);
router.put('/:id/location', authenticate, updateVehicleLocation);
router.put('/:id/status', authenticate, authorize('admin'), updateVehicleStatus);

export default router;

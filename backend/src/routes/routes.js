import express from 'express';
import {
  createRoute,
  getRoutes,
  getRouteById,
  updateRouteStatus,
  updateRouteStop,
  getRouteAnalytics,
} from '../controllers/routeController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { apiLimiter, createLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', authenticate, apiLimiter, getRoutes);
router.get('/analytics', authenticate, authorize('admin'), getRouteAnalytics);
router.get('/:id', authenticate, apiLimiter, getRouteById);
router.post('/', authenticate, authorize('admin'), createLimiter, createRoute);
router.put('/:id/status', authenticate, authorize('admin'), updateRouteStatus);
router.put('/:id/stop', authenticate, updateRouteStop);

export default router;

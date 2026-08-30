import express from 'express';
import {
  createRoute,
  getRoutes,
  getRouteById,
  updateRouteStatus,
  updateRouteStop,
  getRouteAnalytics,
  getLogisticsMapData,
  getLogisticsLiveData,
  updateLogisticsLiveToggle,
  seedChennaiDemoData,
} from '../controllers/routeController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { apiLimiter, createLimiter, liveTrackingLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', authenticate, apiLimiter, getRoutes);
router.get('/logistics-map', authenticate, apiLimiter, getLogisticsMapData);
router.get('/logistics-live', authenticate, liveTrackingLimiter, getLogisticsLiveData);
router.put('/logistics-live/toggle', authenticate, authorize('admin'), apiLimiter, updateLogisticsLiveToggle);
router.get('/analytics', authenticate, authorize('admin'), getRouteAnalytics);
router.get('/:id', authenticate, apiLimiter, getRouteById);
router.post('/', authenticate, authorize('admin'), createLimiter, createRoute);
router.post('/seed-demo/chennai', authenticate, authorize('admin'), createLimiter, seedChennaiDemoData);
router.put('/:id/status', authenticate, authorize('admin'), updateRouteStatus);
router.put('/:id/stop', authenticate, updateRouteStop);

export default router;

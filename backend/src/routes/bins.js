import express from 'express';
import {
  getAllBins,
  getBinById,
  createBin,
  updateBin,
  deleteBin,
  getBinAnalytics,
  getNearbyBins,
} from '../controllers/binController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { apiLimiter, createLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', apiLimiter, getAllBins);
router.get('/nearby', apiLimiter, getNearbyBins);
router.get('/analytics', authenticate, authorize('admin'), getBinAnalytics);
router.get('/:id', apiLimiter, getBinById);
router.post('/', createLimiter, authenticate, authorize('admin'), createBin);
router.put('/:id', authenticate, authorize('admin'), updateBin);
router.delete('/:id', authenticate, authorize('admin'), deleteBin);

export default router;

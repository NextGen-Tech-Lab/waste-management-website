import express from 'express';
import {
  createContent,
  getContent,
  getContentById,
  updateContent,
  deleteContent,
  likeContent,
  getContentAnalytics,
} from '../controllers/educationController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { apiLimiter, createLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', apiLimiter, authenticate, getContent);
router.get('/analytics', authenticate, authorize('admin'), getContentAnalytics);
router.get('/:id', apiLimiter, authenticate, getContentById);
router.post('/', authenticate, authorize('admin'), createLimiter, createContent);
router.put('/:id', authenticate, authorize('admin'), updateContent);
router.delete('/:id', authenticate, authorize('admin'), deleteContent);
router.put('/:id/like', authenticate, likeContent);

export default router;

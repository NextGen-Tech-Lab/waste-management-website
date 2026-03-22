import express from 'express';
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  acceptComplaint,
  rejectComplaint,
  markComplaintFixed,
  getComplaintAnalytics,
} from '../controllers/complaintController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { apiLimiter, createLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', authenticate, apiLimiter, getComplaints);
router.get('/analytics', authenticate, authorize('admin'), getComplaintAnalytics);
router.get('/:id', authenticate, apiLimiter, getComplaintById);
router.post('/', authenticate, createLimiter, createComplaint);
router.put('/:id/status', authenticate, authorize('admin'), updateComplaintStatus);
router.put('/:id/assign', authenticate, authorize('admin'), assignComplaint);
router.put('/:id/accept', authenticate, authorize('admin'), acceptComplaint);
router.put('/:id/reject', authenticate, authorize('admin'), rejectComplaint);
router.put('/:id/fix', authenticate, authorize('admin'), markComplaintFixed);

export default router;

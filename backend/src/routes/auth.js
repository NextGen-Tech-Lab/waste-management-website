import express from 'express';
import { register, login, getProfile, updateProfile, deleteAccount } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.delete('/account', authenticate, deleteAccount);

export default router;

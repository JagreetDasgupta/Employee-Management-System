import express from 'express';
import { register, login, getProfile, changePassword, updateProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/change-password', authenticateToken, changePassword);
router.put('/profile', authenticateToken, updateProfile);

export default router; 
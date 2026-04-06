import express from 'express';
import { loginUser, registerUser, logoutUser, updateUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateProfileUpdate } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.put('/profile', protect, validateProfileUpdate, updateUserProfile);

export default router;

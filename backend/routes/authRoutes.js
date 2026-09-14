import express from 'express';
import { registerUser, loginUser, logoutUser, verifyEmailOtp, resendVerificationOtp} from '../controllers/authController.js';

const router = express.Router();

// Signup Route: POST /api/auth/register
router.post('/register', registerUser);

// Login Route: POST /api/auth/login
router.post('/login', loginUser);

// Logout Route: POST /api/auth/logout
router.post('/logout', logoutUser);

router.post('/verify-email', verifyEmailOtp);
router.post('/resend-verification', resendVerificationOtp);

export default router;
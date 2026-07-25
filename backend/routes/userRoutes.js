import express from 'express';
import { login, requestOtp, verifyOtpAndSignup, editProfile, getProfile } from '../controllers/userController.js';
 import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtpAndSignup);
router.put('/edit-profile', authMiddleware, editProfile);
router.get('/profile', authMiddleware, getProfile);

export default router;

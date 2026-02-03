/**
 * Auth API routes: register, login, logout, me.
 */

import { Router } from 'express';
import * as authController from '../controllers/authController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.me);

router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOTP);
router.post('/reset-password', authController.resetPassword);

export default router;
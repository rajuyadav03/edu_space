import express from 'express';
import { register, login, getMe, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { registerRules, loginRules, forgotPasswordRules, resetPasswordRules, validate } from '../middleware/validator.js';

const router = express.Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPasswordRules, validate, forgotPassword);
router.put('/reset-password/:token', resetPasswordRules, validate, resetPassword);

export default router;


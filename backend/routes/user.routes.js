import express from 'express';
import {
  getProfile,
  updateProfile,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  submitKYC,
  getPendingKYC,
  verifyKYC
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/kyc', protect, authorize('teacher'), submitKYC);
router.get('/kyc/pending', protect, authorize('admin'), getPendingKYC);
router.put('/kyc/:userId/verify', protect, authorize('admin'), verifyKYC);
router.get('/favorites', protect, authorize('teacher'), getFavorites);
router.post('/favorites/:listingId', protect, authorize('teacher'), addToFavorites);
router.delete('/favorites/:listingId', protect, authorize('teacher'), removeFromFavorites);

export default router;


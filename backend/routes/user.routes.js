import express from 'express';
import {
  getProfile,
  updateProfile,
  addToFavorites,
  removeFromFavorites,
  getFavorites
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/favorites', protect, authorize('teacher'), getFavorites);
router.post('/favorites/:listingId', protect, authorize('teacher'), addToFavorites);
router.delete('/favorites/:listingId', protect, authorize('teacher'), removeFromFavorites);

export default router;

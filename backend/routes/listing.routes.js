import express from 'express';
import {
  getAllListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getMyListings
} from '../controllers/listing.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { listingRules, validate } from '../middleware/validator.js';

const router = express.Router();

router.get('/', getAllListings);
router.get('/my-listings', protect, authorize('school'), getMyListings);
router.get('/:id', getListing);
router.post('/', protect, authorize('school'), listingRules, validate, createListing);
router.put('/:id', protect, authorize('school'), listingRules, validate, updateListing);
router.delete('/:id', protect, authorize('school'), deleteListing);

export default router;

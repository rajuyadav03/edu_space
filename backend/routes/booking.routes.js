import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingRequests,
  updateBookingStatus,
  cancelBooking,
  getBooking
} from '../controllers/booking.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, authorize('teacher'), createBooking);
router.get('/my-bookings', protect, authorize('teacher'), getMyBookings);
router.get('/requests', protect, authorize('school'), getBookingRequests);
router.get('/:id', protect, getBooking);
router.put('/:id/status', protect, authorize('school'), updateBookingStatus);
router.put('/:id/cancel', protect, authorize('teacher'), cancelBooking);

export default router;

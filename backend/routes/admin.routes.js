import express from 'express';
import {
    getStats,
    getAllUsers,
    deleteUser,
    getAllListings,
    deleteListingAdmin,
    getAllBookings,
    updateBookingStatusAdmin,
    deleteBookingAdmin
} from '../controllers/admin.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require admin authentication
router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/listings', getAllListings);
router.delete('/listings/:id', deleteListingAdmin);
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatusAdmin);
router.delete('/bookings/:id', deleteBookingAdmin);

export default router;

import User from '../models/User.model.js';
import Listing from '../models/Listing.model.js';
import Booking from '../models/Booking.model.js';

// @desc    Get platform stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
export const getStats = async (req, res, next) => {
    try {
        const [
            totalUsers,
            totalTeachers,
            totalSchools,
            totalListings,
            activeListings,
            totalBookings,
            pendingBookings,
            confirmedBookings,
            revenueResult
        ] = await Promise.all([
            User.countDocuments({ role: { $ne: 'admin' } }),
            User.countDocuments({ role: 'teacher' }),
            User.countDocuments({ role: 'school' }),
            Listing.countDocuments(),
            Listing.countDocuments({ status: 'active' }),
            Booking.countDocuments(),
            Booking.countDocuments({ status: 'pending' }),
            Booking.countDocuments({ status: 'confirmed' }),
            Booking.aggregate([
                { $match: { status: { $in: ['confirmed', 'completed'] } } },
                { $group: { _id: null, total: { $sum: '$totalPrice' } } }
            ])
        ]);

        const totalRevenue = revenueResult[0]?.total || 0;

        // Recent bookings for overview
        const recentBookings = await Booking.find()
            .populate('listing', 'name spaceType')
            .populate('teacher', 'name email')
            .populate('school', 'schoolName')
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalTeachers,
                totalSchools,
                totalListings,
                activeListings,
                totalBookings,
                pendingBookings,
                confirmedBookings,
                totalRevenue
            },
            recentBookings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/admin/users?search=&role=
// @access  Private (Admin only)
export const getAllUsers = async (req, res, next) => {
    try {
        const { search, role } = req.query;
        let query = { role: { $ne: 'admin' } }; // Don't show admin users

        if (role && role !== 'all') {
            query.role = role;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { schoolName: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
            // Keep the role filter if set
            if (role && role !== 'all') {
                query.role = role;
            }
        }

        const users = await User.find(query)
            .select('-password -resetPasswordToken -resetPasswordExpire -googleId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a user (and their listings)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete admin users'
            });
        }

        // If school, delete their listings and associated bookings
        if (user.role === 'school') {
            const listings = await Listing.find({ owner: user._id });
            const listingIds = listings.map(l => l._id);
            await Booking.deleteMany({ listing: { $in: listingIds } });
            await Listing.deleteMany({ owner: user._id });
        }

        // If teacher, delete their bookings
        if (user.role === 'teacher') {
            await Booking.deleteMany({ teacher: user._id });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: `User "${user.name}" and associated data deleted successfully`
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all listings
// @route   GET /api/admin/listings?search=
// @access  Private (Admin only)
export const getAllListings = async (req, res, next) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { spaceType: { $regex: search, $options: 'i' } }
            ];
        }

        const listings = await Listing.find(query)
            .populate('owner', 'name schoolName email phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: listings.length,
            listings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete any listing
// @route   DELETE /api/admin/listings/:id
// @access  Private (Admin only)
export const deleteListingAdmin = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: 'Listing not found'
            });
        }

        // Delete associated bookings
        await Booking.deleteMany({ listing: listing._id });
        await listing.deleteOne();

        res.status(200).json({
            success: true,
            message: `Listing "${listing.name}" deleted successfully`
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings?search=&status=
// @access  Private (Admin only)
export const getAllBookings = async (req, res, next) => {
    try {
        const { search, status } = req.query;
        let query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        let bookings = await Booking.find(query)
            .populate('listing', 'name spaceType location price')
            .populate('teacher', 'name email phone')
            .populate('school', 'schoolName email phone')
            .sort({ createdAt: -1 });

        // Client-side search across populated fields
        if (search) {
            const searchLower = search.toLowerCase();
            bookings = bookings.filter(b =>
                b.listing?.name?.toLowerCase().includes(searchLower) ||
                b.teacher?.name?.toLowerCase().includes(searchLower) ||
                b.teacher?.email?.toLowerCase().includes(searchLower) ||
                b.school?.schoolName?.toLowerCase().includes(searchLower) ||
                b.purpose?.toLowerCase().includes(searchLower)
            );
        }

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update any booking status
// @route   PUT /api/admin/bookings/:id/status
// @access  Private (Admin only)
export const updateBookingStatusAdmin = async (req, res, next) => {
    try {
        const { status } = req.body;

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        booking.status = status;
        await booking.save();

        await booking.populate([
            { path: 'listing', select: 'name spaceType location' },
            { path: 'teacher', select: 'name email phone' },
            { path: 'school', select: 'schoolName email phone' }
        ]);

        res.status(200).json({
            success: true,
            message: `Booking status updated to "${status}"`,
            booking
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete any booking
// @route   DELETE /api/admin/bookings/:id
// @access  Private (Admin only)
export const deleteBookingAdmin = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        await booking.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Booking deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

import Booking from '../models/Booking.model.js';
import Listing from '../models/Listing.model.js';
import User from '../models/User.model.js';

// Security deposit amounts by space type
const DEPOSIT_BY_SPACE_TYPE = {
  'Classroom': 500,
  'Laboratory': 2000,
  'Auditorium': 3000,
  'Sports Hall': 1500,
  'Library': 1000,
  'Conference Room': 1000
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private (Teacher only)
export const createBooking = async (req, res, next) => {
  try {
    const { listingId, bookingDate, timeSlot, purpose, numberOfStudents, specialRequirements, termsAccepted } = req.body;

    // --- KYC Verification Gate ---
    const teacher = await User.findById(req.user.id);
    if (!teacher || teacher.idVerificationStatus !== 'verified') {
      return res.status(403).json({
        success: false,
        message: 'You must complete ID verification from your Profile page before booking. Your identity must be verified by an admin.'
      });
    }

    // --- Terms & Conditions ---
    if (!termsAccepted) {
      return res.status(400).json({
        success: false,
        message: 'You must accept the terms and conditions to proceed with booking'
      });
    }

    // Get listing
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Calculate price based on time slot
    let basePrice = listing.price;
    if (timeSlot.includes('Half Day')) {
      basePrice = Math.round(listing.price * 0.6); // 60% of full day price
    }
    const serviceFee = Math.round(basePrice * 0.1); // 10% platform fee
    const totalPrice = basePrice + serviceFee;

    // Calculate security deposit based on space type
    const securityDeposit = DEPOSIT_BY_SPACE_TYPE[listing.spaceType] || 500;

    // Create booking
    const booking = await Booking.create({
      listing: listingId,
      teacher: req.user.id,
      school: listing.owner,
      bookingDate,
      timeSlot,
      basePrice,
      serviceFee,
      totalPrice,
      purpose,
      numberOfStudents,
      specialRequirements,
      securityDeposit,
      termsAccepted
    });

    // Populate booking details
    await booking.populate([
      { path: 'listing', select: 'name spaceType location' },
      { path: 'teacher', select: 'name email phone subject' },
      { path: 'school', select: 'schoolName email phone' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking request created successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my bookings (Teacher)
// @route   GET /api/bookings/my-bookings
// @access  Private (Teacher only)
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ teacher: req.user.id })
      .populate('listing', 'name spaceType location images')
      .populate('school', 'schoolName phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking requests (School)
// @route   GET /api/bookings/requests
// @access  Private (School only)
export const getBookingRequests = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ school: req.user.id })
      .populate('listing', 'name spaceType location')
      .populate('teacher', 'name email phone subject')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (School only)
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is the school owner
    if (booking.school.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    booking.status = status;
    await booking.save();

    await booking.populate([
      { path: 'listing', select: 'name spaceType location' },
      { path: 'teacher', select: 'name email phone' }
    ]);

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking (Teacher)
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Teacher only)
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is the teacher
    if (booking.teacher.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Can only cancel pending or confirmed bookings
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this booking'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('listing')
      .populate('teacher', 'name email phone subject experience')
      .populate('school', 'schoolName email phone address');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    if (
      booking.teacher.toString() !== req.user.id &&
      booking.school.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resolve security deposit (refund or deduct)
// @route   PUT /api/bookings/:id/deposit
// @access  Private (School only)
export const resolveDeposit = async (req, res, next) => {
  try {
    const { depositStatus, depositDeductionAmount, depositDeductionReason } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is the school owner
    if (booking.school.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to resolve deposit for this booking'
      });
    }

    // Booking must be completed or confirmed to resolve deposit
    if (!['completed', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Deposit can only be resolved for completed or confirmed bookings'
      });
    }

    // Validate deposit status
    if (!['refunded', 'partially_deducted', 'fully_deducted'].includes(depositStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid deposit status'
      });
    }

    // Validate deduction amount
    if (depositStatus !== 'refunded') {
      if (!depositDeductionAmount || depositDeductionAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Deduction amount is required'
        });
      }
      if (depositDeductionAmount > booking.securityDeposit) {
        return res.status(400).json({
          success: false,
          message: 'Deduction amount cannot exceed the security deposit'
        });
      }
      if (!depositDeductionReason) {
        return res.status(400).json({
          success: false,
          message: 'A reason is required when deducting from the deposit'
        });
      }
    }

    booking.depositStatus = depositStatus;
    booking.depositDeductionAmount = depositStatus === 'refunded' ? 0 : depositDeductionAmount;
    booking.depositDeductionReason = depositStatus === 'refunded' ? '' : depositDeductionReason;
    await booking.save();

    await booking.populate([
      { path: 'listing', select: 'name spaceType location' },
      { path: 'teacher', select: 'name email phone' }
    ]);

    res.status(200).json({
      success: true,
      message: `Deposit ${depositStatus === 'refunded' ? 'refunded' : 'deducted'} successfully`,
      booking
    });
  } catch (error) {
    next(error);
  }
};


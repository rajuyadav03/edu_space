import User from '../models/User.model.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites', 'name spaceType location price images');

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const allowedUpdates = ['name', 'phone', 'avatar', 'schoolName', 'address', 'subject', 'experience'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit KYC verification (teacher only)
// @route   PUT /api/users/kyc
// @access  Private (Teacher only)
export const submitKYC = async (req, res, next) => {
  try {
    const { aadhaarNumber, panNumber, idDocumentUrl } = req.body;

    // At least one ID is required
    if (!aadhaarNumber && !panNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one ID (Aadhaar or PAN number)'
      });
    }

    // ID document photo is required
    if (!idDocumentUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a photo/URL of your ID document'
      });
    }

    // Validate Aadhaar format (12 digits)
    if (aadhaarNumber && !/^\d{12}$/.test(aadhaarNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Aadhaar number must be exactly 12 digits'
      });
    }

    // Validate PAN format (10 alphanumeric)
    if (panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNumber.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'PAN number must be in format: ABCDE1234F'
      });
    }

    // Store only last 4 characters (masked)
    const updates = {
      idDocumentUrl,
      idVerificationStatus: 'pending',
      idVerificationNote: ''
    };

    if (aadhaarNumber) {
      updates.aadhaarLast4 = aadhaarNumber.slice(-4);
    }
    if (panNumber) {
      updates.panLast4 = panNumber.toUpperCase().slice(-4);
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'KYC documents submitted for verification. Your ID will be reviewed by an admin.',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pending KYC submissions (Admin only)
// @route   GET /api/users/kyc/pending
// @access  Private (Admin only)
export const getPendingKYC = async (req, res, next) => {
  try {
    const users = await User.find({
      role: 'teacher',
      idVerificationStatus: { $in: ['pending', 'rejected'] }
    }).select('name email phone aadhaarLast4 panLast4 idDocumentUrl idVerificationStatus idVerificationNote createdAt');

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify/Reject KYC (Admin only)
// @route   PUT /api/users/kyc/:userId/verify
// @access  Private (Admin only)
export const verifyKYC = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either verified or rejected'
      });
    }

    if (status === 'rejected' && !note) {
      return res.status(400).json({
        success: false,
        message: 'A reason is required when rejecting KYC'
      });
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'teacher') {
      return res.status(400).json({
        success: false,
        message: 'KYC verification is only for teacher accounts'
      });
    }

    user.idVerificationStatus = status;
    user.idVerificationNote = status === 'rejected' ? note : '';
    await user.save();

    res.status(200).json({
      success: true,
      message: `KYC ${status} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        idVerificationStatus: user.idVerificationStatus,
        idVerificationNote: user.idVerificationNote
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add to favorites
// @route   POST /api/users/favorites/:listingId
// @access  Private (Teacher only)
export const addToFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.favorites.includes(req.params.listingId)) {
      return res.status(400).json({
        success: false,
        message: 'Listing already in favorites'
      });
    }

    user.favorites.push(req.params.listingId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Added to favorites',
      favorites: user.favorites
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove from favorites
// @route   DELETE /api/users/favorites/:listingId
// @access  Private (Teacher only)
export const removeFromFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    user.favorites = user.favorites.filter(
      fav => fav.toString() !== req.params.listingId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Removed from favorites',
      favorites: user.favorites
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get favorites
// @route   GET /api/users/favorites
// @access  Private (Teacher only)
export const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');

    res.status(200).json({
      success: true,
      count: user.favorites.length,
      favorites: user.favorites
    });
  } catch (error) {
    next(error);
  }
};


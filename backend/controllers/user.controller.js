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

import Listing from '../models/Listing.model.js';

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
export const getAllListings = async (req, res, next) => {
  try {
    const { spaceType, location, minPrice, maxPrice, minCapacity, maxCapacity, search } = req.query;

    // Build query
    let query = { status: 'active' };

    if (spaceType && spaceType !== 'All') {
      query.spaceType = spaceType;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (minCapacity || maxCapacity) {
      query.capacity = {};
      if (minCapacity) query.capacity.$gte = Number(minCapacity);
      if (maxCapacity) query.capacity.$lte = Number(maxCapacity);
    }

    if (search) {
      query.$text = { $search: search };
    }

    const listings = await Listing.find(query)
      .populate('owner', 'name schoolName phone email')
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

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('owner', 'name schoolName phone email address');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    res.status(200).json({
      success: true,
      listing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create listing
// @route   POST /api/listings
// @access  Private (School only)
export const createListing = async (req, res, next) => {
  try {
    const listingData = {
      ...req.body,
      owner: req.user.id
    };

    const listing = await Listing.create(listingData);

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      listing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private (Owner only)
export const updateListing = async (req, res, next) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check ownership
    if (listing.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing'
      });
    }

    listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      listing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private (Owner only)
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check ownership
    if (listing.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing'
      });
    }

    await listing.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my listings
// @route   GET /api/listings/my-listings
// @access  Private (School only)
export const getMyListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ owner: req.user.id })
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

import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Space name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  spaceType: {
    type: String,
    enum: ['Classroom', 'Laboratory', 'Auditorium', 'Sports Hall', 'Library', 'Conference Room'],
    required: [true, 'Space type is required']
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  amenities: [{
    type: String
  }],
  images: [{
    type: String
  }],
  availability: {
    type: String,
    enum: ['Weekdays', 'Weekends', 'Both'],
    default: 'Both'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search and filtering
listingSchema.index({ location: 'text', name: 'text', description: 'text' });
listingSchema.index({ spaceType: 1, price: 1, capacity: 1 });

export default mongoose.model('Listing', listingSchema);

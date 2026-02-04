import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  timeSlot: {
    type: String,
    enum: ['Full Day', 'Half Day (Morning)', 'Half Day (Evening)'],
    required: [true, 'Time slot is required']
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  purpose: {
    type: String,
    required: [true, 'Purpose is required']
  },
  numberOfStudents: {
    type: Number,
    required: true,
    min: 1
  },
  specialRequirements: {
    type: String,
    default: ''
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'upi', 'card', 'bank_transfer'],
    default: 'cash'
  }
}, {
  timestamps: true
});

// Index for queries
bookingSchema.index({ teacher: 1, status: 1 });
bookingSchema.index({ school: 1, status: 1 });
bookingSchema.index({ listing: 1, bookingDate: 1 });

export default mongoose.model('Booking', bookingSchema);

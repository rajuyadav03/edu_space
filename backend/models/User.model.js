import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: function () { return !this.googleId; },
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  googleId: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['teacher', 'school', 'admin'],
    required: [true, 'Role is required']
  },
  phone: {
    type: String,
    default: ''
  },
  // School-specific fields
  schoolName: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  // Teacher-specific fields
  subject: {
    type: String,
    default: ''
  },
  experience: {
    type: Number,
    default: 0
  },
  // Common fields
  avatar: {
    type: String,
    default: ''
  },
  verified: {
    type: Boolean,
    default: false
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing'
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate and hash password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

  return resetToken;
};

export default mongoose.model('User', userSchema);

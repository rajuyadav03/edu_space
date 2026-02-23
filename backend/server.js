import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import connectDB from './config/db.js';
import configurePassport from './config/passport.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Configure Passport for Google OAuth
configurePassport();

// Set security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration for development and production
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow any Vercel deployment URL
    if (origin.match(/^https:\/\/.*\.vercel\.app$/)) {
      return callback(null, true);
    }

    // Allow any Render deployment URL
    if (origin.match(/^https:\/\/.*\.onrender\.com$/)) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sanitize data
app.use(mongoSanitize());

// Prevent http param pollution
app.use(hpp());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EduSpace API is running',
    timestamp: new Date().toISOString()
  });
});

// Import routes
import authRoutes from './routes/auth.routes.js';
import listingRoutes from './routes/listing.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import adminRoutes from './routes/admin.routes.js';
import userRoutes from './routes/user.routes.js';

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Initialize Passport (no sessions - we use JWT)
app.use(passport.initialize());

// Google OAuth Routes
// GET /api/auth/google - Redirect to Google consent screen
app.get('/api/auth/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'your-google-client-id') {
    return res.status(503).json({
      success: false,
      message: 'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env'
    });
  }
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});

// GET /api/auth/google/callback - Handle Google callback
app.get('/api/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=google_auth_failed' }),
  (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
      });

      const user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone
      };

      // Redirect to frontend callback page with token and user data
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const userStr = encodeURIComponent(JSON.stringify(user));
      res.redirect(`${frontendUrl}/auth/google/callback?token=${token}&user=${userStr}`);
    } catch (error) {
      console.error('Google callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/auth/google/callback?error=${encodeURIComponent('Authentication failed')}`);
    }
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

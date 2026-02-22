import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.model.js';

/**
 * Configure Google OAuth 2.0 Strategy
 * 
 * Setup instructions:
 * 1. Go to https://console.cloud.google.com
 * 2. Create a new project (or select existing)
 * 3. Go to APIs & Services > Credentials
 * 4. Create OAuth 2.0 Client ID (Web Application)
 * 5. Add authorized redirect URI: http://localhost:5000/api/auth/google/callback
 * 6. Copy Client ID and Secret to .env
 */
const configurePassport = () => {
    // Only configure if credentials are provided
    if (!process.env.GOOGLE_CLIENT_ID ||
        process.env.GOOGLE_CLIENT_ID === 'your-google-client-id') {
        console.log('⚠️  Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env');
        return;
    }

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
                scope: ['profile', 'email']
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Check if user already exists with this Google ID
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        return done(null, user);
                    }

                    // Check if user exists with same email (link accounts)
                    user = await User.findOne({ email: profile.emails[0].value });

                    if (user) {
                        // Link Google account to existing user
                        user.googleId = profile.id;
                        if (!user.avatar && profile.photos?.[0]?.value) {
                            user.avatar = profile.photos[0].value;
                        }
                        await user.save({ validateBeforeSave: false });
                        return done(null, user);
                    }

                    // Create new user from Google profile
                    user = await User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        googleId: profile.id,
                        avatar: profile.photos?.[0]?.value || '',
                        role: 'teacher', // Default role, user can change later
                        phone: '',
                        verified: true
                    });

                    return done(null, user);
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );

    // Serialization (not using sessions, but required by passport)
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};

export default configurePassport;

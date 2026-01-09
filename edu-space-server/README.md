# EduSpace Backend API

Node.js + Express + MongoDB backend for EduSpace platform.

## Setup Instructions

### 1. Install Dependencies
```bash
cd edu-space-server
npm install
```

### 2. Setup MongoDB
- Install MongoDB locally OR use MongoDB Atlas
- Update `MONGODB_URI` in `.env` file

### 3. Configure Environment
Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

### 4. Run Server
Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user (Protected)

### Listings
- GET `/api/listings` - Get all listings
- GET `/api/listings/:id` - Get single listing
- POST `/api/listings` - Create listing (School only)
- PUT `/api/listings/:id` - Update listing (Owner only)
- DELETE `/api/listings/:id` - Delete listing (Owner only)
- GET `/api/listings/my-listings` - Get my listings (School only)

### Bookings
- POST `/api/bookings` - Create booking (Teacher only)
- GET `/api/bookings/my-bookings` - Get my bookings (Teacher only)
- GET `/api/bookings/requests` - Get booking requests (School only)
- GET `/api/bookings/:id` - Get single booking
- PUT `/api/bookings/:id/status` - Update booking status (School only)
- PUT `/api/bookings/:id/cancel` - Cancel booking (Teacher only)

### Users
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update user profile
- GET `/api/users/favorites` - Get favorites (Teacher only)
- POST `/api/users/favorites/:listingId` - Add to favorites (Teacher only)
- DELETE `/api/users/favorites/:listingId` - Remove from favorites (Teacher only)

## Project Structure
```
edu-space-server/
├── config/
│   └── db.js
├── controllers/
│   ├── auth.controller.js
│   ├── booking.controller.js
│   ├── listing.controller.js
│   └── user.controller.js
├── middleware/
│   └── auth.middleware.js
├── models/
│   ├── Booking.model.js
│   ├── Listing.model.js
│   └── User.model.js
├── routes/
│   ├── auth.routes.js
│   ├── booking.routes.js
│   ├── listing.routes.js
│   └── user.routes.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

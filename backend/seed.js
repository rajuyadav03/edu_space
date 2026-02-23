import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model.js';
import Listing from './models/Listing.model.js';
import Booking from './models/Booking.model.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing data
    await User.deleteMany();
    await Listing.deleteMany();
    await Booking.deleteMany();
    console.log('Cleared existing data');

    // Create admin user
    await User.create({
      name: 'Super Admin',
      email: 'admin@eduspace.in',
      password: 'Admin@123',
      role: 'admin',
      phone: '+91 9000000000'
    });
    console.log('Admin user created');


    // Create school users
    const schools = await User.create([
      {
        name: 'Admin',
        email: 'school@abc.com',
        password: 'password123',
        role: 'school',
        phone: '+91 9876543210',
        schoolName: 'ABC Public School',
        address: 'Andheri West, Mumbai'
      },
      {
        name: 'Admin',
        email: 'school@xyz.com',
        password: 'password123',
        role: 'school',
        phone: '+91 9876543211',
        schoolName: 'XYZ College',
        address: 'Borivali West, Mumbai'
      }
    ]);

    // Create teacher users
    await User.create([
      {
        name: 'Rajesh Kumar',
        email: 'teacher@example.com',
        password: 'password123',
        role: 'teacher',
        phone: '+91 9876543212',
        subject: 'Mathematics',
        experience: 5
      }
    ]);

    // Create listings
    await Listing.create([
      {
        name: 'ABC Public School - Science Lab',
        description: 'Well-equipped science laboratory with modern equipment and safety measures.',
        spaceType: 'Laboratory',
        capacity: 40,
        price: 1500,
        location: 'Andheri West, Mumbai',
        coordinates: { lat: 19.1334, lng: 72.8480 },
        amenities: ['Projector', 'WiFi', 'Air Conditioning', 'Lab Equipment', 'Safety Equipment'],
        images: ['https://images.unsplash.com/photo-1588072432836-e10032774350?w=800'],
        availability: 'Both',
        owner: schools[0]._id,
        status: 'active'
      },
      {
        name: 'ABC Public School - Main Classroom',
        description: 'Spacious classroom with modern teaching aids and comfortable seating.',
        spaceType: 'Classroom',
        capacity: 50,
        price: 1000,
        location: 'Andheri West, Mumbai',
        coordinates: { lat: 19.1334, lng: 72.8480 },
        amenities: ['Projector', 'WiFi', 'Air Conditioning', 'Whiteboard'],
        images: ['https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800'],
        availability: 'Both',
        owner: schools[0]._id,
        status: 'active'
      },
      {
        name: 'XYZ College - Auditorium',
        description: 'Large auditorium with stage, sound system, and seating for 200 people.',
        spaceType: 'Auditorium',
        capacity: 200,
        price: 3500,
        location: 'Borivali West, Mumbai',
        coordinates: { lat: 19.2306, lng: 72.8567 },
        amenities: ['Stage', 'Sound System', 'Air Conditioning', 'Projector', 'Green Room'],
        images: ['https://images.unsplash.com/photo-1562774053-701939374585?w=800'],
        availability: 'Weekends',
        owner: schools[1]._id,
        status: 'active'
      },
      {
        name: 'XYZ College - Computer Lab',
        description: 'Modern computer lab with 50 systems and high-speed internet.',
        spaceType: 'Laboratory',
        capacity: 50,
        price: 2000,
        location: 'Borivali West, Mumbai',
        coordinates: { lat: 19.2306, lng: 72.8567 },
        amenities: ['50 Computers', 'High-Speed WiFi', 'Air Conditioning', 'Projector'],
        images: ['https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800'],
        availability: 'Both',
        owner: schools[1]._id,
        status: 'active'
      }
    ]);

    console.log('✅ Seed data created successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

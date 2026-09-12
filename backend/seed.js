import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Service from './models/Service.js';
import Location from './models/Location.js';
import Offer from './models/Offer.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await Location.deleteMany({});
    await Offer.deleteMany({});
    console.log('Cleared existing data');

    // Create locations
    const locations = await Location.insertMany([
      {
        name: 'Hasanparthi',
        city: 'Warangal',
        state: 'Telangana',
        coordinates: { type: 'Point', coordinates: [79.143, 17.933] },
        isActive: true,
      },
      {
        name: 'Bheemaram',
        city: 'Warangal',
        state: 'Telangana',
        coordinates: { type: 'Point', coordinates: [79.542, 17.948] },
        isActive: true,
      },
      {
        name: 'Kakatiya University Area',
        city: 'Warangal',
        state: 'Telangana',
        coordinates: { type: 'Point', coordinates: [79.607, 17.905] },
        isActive: true,
      },
      {
        name: 'Hanamkonda',
        city: 'Warangal',
        state: 'Telangana',
        coordinates: { type: 'Point', coordinates: [79.137, 17.985] },
        isActive: true,
      },
      {
        name: 'Warangal City Centre',
        city: 'Warangal',
        state: 'Telangana',
        coordinates: { type: 'Point', coordinates: [79.59, 17.96] },
        isActive: true,
      },
    ]);
    console.log('Created locations');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@onecallservice.com',
      phone: '9876543210',
      password: 'Admin123',
      role: 'admin',
      isActive: true,
    });
    console.log('Created admin user');

    // Create sample services
    const services = await Service.insertMany([
      // Plumber services
      {
        name: 'Pipe Repair & Installation',
        category: 'Plumber',
        description: 'Expert pipe repair, replacement, and installation services',
        basePrice: 299,
        image: 'https://via.placeholder.com/300x200?text=Plumber',
        estimatedTime: '45 mins',
        rating: 4.8,
        reviewCount: 156,
        isActive: true,
      },
      {
        name: 'Water Tap Repair',
        category: 'Plumber',
        description: 'Fix leaking taps and install new taps',
        basePrice: 199,
        image: 'https://via.placeholder.com/300x200?text=Tap+Repair',
        estimatedTime: '30 mins',
        rating: 4.7,
        reviewCount: 243,
        isActive: true,
      },
      {
        name: 'Toilet Repair & Maintenance',
        category: 'Plumber',
        description: 'Complete toilet repair, maintenance and installation',
        basePrice: 349,
        image: 'https://via.placeholder.com/300x200?text=Toilet',
        estimatedTime: '1 hour',
        rating: 4.6,
        reviewCount: 189,
        isActive: true,
      },
      {
        name: 'Drain Cleaning',
        category: 'Plumber',
        description: 'Professional drain cleaning and unclogging',
        basePrice: 399,
        image: 'https://via.placeholder.com/300x200?text=Drain',
        estimatedTime: '1.5 hours',
        rating: 4.5,
        reviewCount: 87,
        isActive: true,
      },
      // House Cleaning services
      {
        name: 'Full House Cleaning',
        category: 'House Cleaning',
        description: 'Complete deep cleaning of your house',
        basePrice: 799,
        image: 'https://via.placeholder.com/300x200?text=House+Cleaning',
        estimatedTime: '3-4 hours',
        rating: 4.9,
        reviewCount: 512,
        isActive: true,
      },
      {
        name: 'Kitchen Cleaning',
        category: 'House Cleaning',
        description: 'Professional kitchen cleaning and sanitization',
        basePrice: 399,
        image: 'https://via.placeholder.com/300x200?text=Kitchen',
        estimatedTime: '1.5 hours',
        rating: 4.7,
        reviewCount: 298,
        isActive: true,
      },
      {
        name: 'Bathroom Cleaning',
        category: 'House Cleaning',
        description: 'Deep cleaning and sanitization of bathrooms',
        basePrice: 299,
        image: 'https://via.placeholder.com/300x200?text=Bathroom',
        estimatedTime: '1 hour',
        rating: 4.8,
        reviewCount: 445,
        isActive: true,
      },
      // Electrical services
      {
        name: 'Light Installation',
        category: 'Electrical Services',
        description: 'Install new lights and fixtures',
        basePrice: 299,
        image: 'https://via.placeholder.com/300x200?text=Lights',
        estimatedTime: '1 hour',
        rating: 4.6,
        reviewCount: 178,
        isActive: true,
      },
      {
        name: 'Fan Installation',
        category: 'Electrical Services',
        description: 'Install and repair ceiling and wall fans',
        basePrice: 249,
        image: 'https://via.placeholder.com/300x200?text=Fan',
        estimatedTime: '45 mins',
        rating: 4.7,
        reviewCount: 256,
        isActive: true,
      },
      {
        name: 'Wiring & Circuit Repair',
        category: 'Electrical Services',
        description: 'Complete electrical wiring and circuit repair',
        basePrice: 499,
        image: 'https://via.placeholder.com/300x200?text=Wiring',
        estimatedTime: '2 hours',
        rating: 4.5,
        reviewCount: 134,
        isActive: true,
      },
      // Hair services
      {
        name: 'Professional Haircut',
        category: 'Haircut',
        description: 'Professional haircut with styling',
        basePrice: 199,
        image: 'https://via.placeholder.com/300x200?text=Haircut',
        estimatedTime: '45 mins',
        rating: 4.8,
        reviewCount: 567,
        isActive: true,
      },
      {
        name: 'Hair Coloring',
        category: 'Haircut',
        description: 'Professional hair coloring service',
        basePrice: 499,
        image: 'https://via.placeholder.com/300x200?text=Coloring',
        estimatedTime: '1.5 hours',
        rating: 4.7,
        reviewCount: 289,
        isActive: true,
      },
      // Water tank cleaning
      {
        name: 'Water Tank Cleaning',
        category: 'Water Tank Cleaning',
        description: 'Professional water tank cleaning and sanitization',
        basePrice: 599,
        image: 'https://via.placeholder.com/300x200?text=Tank',
        estimatedTime: '2 hours',
        rating: 4.6,
        reviewCount: 201,
        isActive: true,
      },
      // Mutton cutting
      {
        name: 'Mutton Cutting & Delivery',
        category: 'Mutton Cutter',
        description: 'Fresh mutton cutting and delivery to your home',
        basePrice: 399,
        image: 'https://via.placeholder.com/300x200?text=Mutton',
        estimatedTime: '1 hour',
        rating: 4.9,
        reviewCount: 423,
        isActive: true,
      },
      // Women's haircut
      {
        name: "Women's Professional Haircut",
        category: "Women's Haircut",
        description: 'Professional haircut and styling for women',
        basePrice: 299,
        image: 'https://via.placeholder.com/300x200?text=Women',
        estimatedTime: '1 hour',
        rating: 4.8,
        reviewCount: 621,
        isActive: true,
      },
    ]);
    console.log('Created services');

    // Create sample offers
    await Offer.insertMany([
      {
        title: '20% OFF on All Services',
        description: 'Get 20% discount on all services this week',
        code: 'SAVE20',
        discountType: 'percentage',
        discountValue: 20,
        applicableCategories: ['Plumber', 'Electrical Services', 'House Cleaning'],
        maxUses: 100,
        usedCount: 0,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        title: 'Premium Subscription',
        description: 'Unlimited services at ₹549 per month',
        code: 'PREMIUM',
        discountType: 'fixed',
        discountValue: 100,
        applicableCategories: [],
        maxUses: 1000,
        usedCount: 0,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        title: '₹100 OFF on First Booking',
        description: 'Get ₹100 discount on your first service',
        code: 'FIRST100',
        discountType: 'fixed',
        discountValue: 100,
        applicableCategories: [],
        maxUses: 500,
        usedCount: 0,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    ]);
    console.log('Created offers');

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

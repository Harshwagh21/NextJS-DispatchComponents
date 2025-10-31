// Seed script to create initial users, fleets, and charts
// Run with: node seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Fleet = require('./models/Fleet');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    console.log('Cleared existing users');
    
    await Fleet.deleteMany({});
    console.log('Cleared existing fleets');

    // Create sample users
    const users = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        authority: 'HQM',
        location: null,
        fleet: null,
      },
      {
        username: 'fleetmanager_pune',
        email: 'fm_pune@example.com',
        password: 'fm123',
        authority: 'FM',
        location: 'Pune',
        fleet: 'Zomato Fleet Pune',
      },
      {
        username: 'fleetmanager_bangalore',
        email: 'fm_bangalore@example.com',
        password: 'fm123',
        authority: 'FM',
        location: 'Bangalore',
        fleet: 'Zomato Fleet Bangalore',
      },
      {
        username: 'fleetmanager_mumbai',
        email: 'fm_mumbai@example.com',
        password: 'fm123',
        authority: 'FM',
        location: 'Mumbai',
        fleet: 'Zomato Fleet Mumbai',
      },
    ];

    const createdUsers = await User.insertMany(users);
    console.log('Created users:', createdUsers.map(u => ({ email: u.email, username: u.username, authority: u.authority })));

    // Create fleets with charts
    const fleets = [
      {
        name: 'Zomato Fleet Pune',
        location: {
          lat: 18.5204,
          lng: 73.8567,
        },
        charts: [
          {
            category: 'Revenue Growth',
            data: [120000, 135000, 148000, 162000, 178000, 195000, 210000],
            summary: 'Revenue increased by 75% over the last 7 months',
          },
          {
            category: 'Order Volume',
            data: [8500, 9200, 9800, 10500, 11200, 11800, 12500],
            summary: 'Order volume grew by 47% with consistent monthly increases',
          },
          {
            category: 'Average Delivery Time',
            data: [32, 30, 28, 27, 26, 25, 24],
            summary: 'Delivery time improved by 25%, now averaging 24 minutes',
          },
          {
            category: 'Customer Satisfaction',
            data: [4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8],
            summary: 'Customer satisfaction improved from 4.2 to 4.8 stars',
          },
          {
            category: 'Fleet Utilization',
            data: [68, 72, 75, 78, 80, 82, 85],
            summary: 'Fleet utilization increased to 85%, showing efficient operations',
          },
          {
            category: 'Driver Retention',
            data: [88, 89, 90, 91, 92, 93, 94],
            summary: 'Driver retention rate improved to 94%',
          },
        ],
      },
      {
        name: 'Zomato Fleet Bangalore',
        location: {
          lat: 12.9716,
          lng: 77.5946,
        },
        charts: [
          {
            category: 'Revenue Growth',
            data: [150000, 168000, 185000, 202000, 220000, 238000, 255000],
            summary: 'Revenue increased by 70% over the last 7 months',
          },
          {
            category: 'Order Volume',
            data: [10200, 11000, 11800, 12500, 13200, 14000, 14800],
            summary: 'Order volume grew by 45% with strong market presence',
          },
          {
            category: 'Average Delivery Time',
            data: [35, 33, 31, 29, 28, 27, 26],
            summary: 'Delivery time reduced by 26%, now averaging 26 minutes',
          },
          {
            category: 'Customer Satisfaction',
            data: [4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7],
            summary: 'Customer satisfaction improved from 4.1 to 4.7 stars',
          },
          {
            category: 'Fleet Utilization',
            data: [65, 70, 73, 76, 78, 80, 83],
            summary: 'Fleet utilization increased to 83%',
          },
          {
            category: 'Driver Retention',
            data: [85, 86, 87, 88, 89, 90, 91],
            summary: 'Driver retention rate improved to 91%',
          },
        ],
      },
      {
        name: 'Zomato Fleet Mumbai',
        location: {
          lat: 19.0760,
          lng: 72.8777,
        },
        charts: [
          {
            category: 'Revenue Growth',
            data: [180000, 198000, 215000, 232000, 250000, 268000, 285000],
            summary: 'Revenue increased by 58% over the last 7 months',
          },
          {
            category: 'Order Volume',
            data: [12500, 13300, 14100, 14900, 15700, 16500, 17200],
            summary: 'Order volume grew by 38% in the competitive Mumbai market',
          },
          {
            category: 'Average Delivery Time',
            data: [38, 36, 34, 32, 30, 29, 28],
            summary: 'Delivery time improved by 26%, now averaging 28 minutes',
          },
          {
            category: 'Customer Satisfaction',
            data: [4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6],
            summary: 'Customer satisfaction improved from 4.0 to 4.6 stars',
          },
          {
            category: 'Fleet Utilization',
            data: [70, 74, 77, 79, 81, 83, 85],
            summary: 'Fleet utilization increased to 85%',
          },
          {
            category: 'Driver Retention',
            data: [82, 83, 84, 85, 86, 87, 88],
            summary: 'Driver retention rate improved to 88%',
          },
        ],
      },
    ];

    const createdFleets = await Fleet.insertMany(fleets);
    console.log('\nCreated fleets:', createdFleets.map(f => ({ 
      name: f.name, 
      charts: f.charts.length + ' charts',
      location: `(${f.location.lat}, ${f.location.lng})`
    })));
    
    console.log('\n✅ Seed completed!');
    console.log('\n📊 Database Summary:');
    console.log(`  Users: ${createdUsers.length}`);
    console.log(`  Fleets: ${createdFleets.length}`);
    console.log(`  Total Charts: ${createdFleets.reduce((sum, f) => sum + f.charts.length, 0)}`);
    
    console.log('\n🔐 Default login credentials:');
    console.log('  Admin: admin@example.com / admin123');
    console.log('  Pune FM: fm_pune@example.com / fm123');
    console.log('  Bangalore FM: fm_bangalore@example.com / fm123');
    console.log('  Mumbai FM: fm_mumbai@example.com / fm123');
    console.log('\n⚠️  WARNING: Change these passwords in production!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();


const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Employee = require('./models/Employee');

async function clearDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for database clearing');

        // Clear all collections
        await User.deleteMany({});
        await Employee.deleteMany({});

        console.log('✅ Database cleared successfully!');
        console.log('📊 Summary:');
        console.log('- All users deleted');
        console.log('- All employees deleted');

    } catch (error) {
        console.error('❌ Error clearing database:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB Disconnected');
    }
}

clearDatabase(); 
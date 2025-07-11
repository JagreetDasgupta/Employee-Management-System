import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for data check');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const checkUserData = async () => {
  try {
    await connectDB();

    console.log('\n🔍 Checking User Data in Database...\n');

    // Get all users
    const users = await User.find({}).select('-password');
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
      return;
    }

    console.log(`✅ Found ${users.length} user(s) in database:\n`);

    users.forEach((user, index) => {
      console.log(`👤 User ${index + 1}:`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Name: ${user.name || '❌ Not set'}`);
      console.log(`   Email: ${user.email || '❌ Not set'}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: ${user.status}`);
      console.log(`   Last Login: ${user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '❌ Never logged in'}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log(`   Updated: ${user.updatedAt}`);
      console.log('');
    });

    // Check for users with missing name/email
    const usersWithMissingData = users.filter(user => !user.name || !user.email);
    
    if (usersWithMissingData.length > 0) {
      console.log('⚠️  Users with missing profile data:');
      usersWithMissingData.forEach(user => {
        console.log(`   - ${user.username}: name=${!!user.name}, email=${!!user.email}`);
      });
    } else {
      console.log('✅ All users have complete profile data!');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error checking user data:', error);
    process.exit(1);
  }
};

checkUserData(); 
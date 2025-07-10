import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// User Schema (simplified for direct DB access)
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'hr']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

async function createUsersDirectly() {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    
    // Users to create
    const users = [
      {
        username: 'admin@admin.com',
        password: 'admin',
        role: 'admin'
      },
      {
        username: 'hr@hr.com',
        password: 'hr',
        role: 'hr'
      }
    ];
    
    console.log('🚀 Creating users directly in database...');
    
    for (const userData of users) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ username: userData.username });
        
        if (existingUser) {
          console.log(`⚠️  User already exists: ${userData.username}`);
          continue;
        }
        
        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        
        // Create user
        const newUser = new User({
          username: userData.username,
          password: hashedPassword,
          role: userData.role,
          status: 'active'
        });
        
        await newUser.save();
        console.log(`✅ Created user: ${userData.username} (${userData.role})`);
        
      } catch (error) {
        console.log(`❌ Error creating ${userData.username}:`, error.message);
      }
    }
    
    console.log('\n🎉 User creation complete!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@admin.com / admin');
    console.log('HR: hr@hr.com / hr');
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the function
createUsersDirectly(); 
import axios from 'axios';

const BASE_URL = 'https://employee-management-system-c5qp.onrender.com';

// Simple login credentials
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

async function addLoginUsers() {
  console.log('🚀 Adding admin and HR users to database...');
  
  for (const user of users) {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/register`, {
        username: user.username,
        password: user.password,
        role: user.role
      });
      
      console.log(`✅ Created user: ${user.username} (${user.role})`);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log(`⚠️  User already exists: ${user.username}`);
      } else {
        console.log(`❌ Error creating ${user.username}: ${error.response?.data?.message || error.message}`);
      }
    }
  }
  
  console.log('\n🎉 Login users setup complete!');
  console.log('\n📋 Login Credentials:');
  console.log('Admin: admin@admin.com / admin');
  console.log('HR: hr@hr.com / hr');
}

// Run the function
addLoginUsers().catch(console.error); 
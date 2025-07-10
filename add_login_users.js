import axios from 'axios';

const BASE_URL = 'https://employee-management-system-c5qp.onrender.com';

// Login credentials to add
const users = [
  {
    name: 'Admin User',
    email: 'admin@company.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'HR User',
    email: 'hr@company.com',
    password: 'hr123',
    role: 'hr'
  },
  {
    name: 'John Doe',
    email: 'john.doe@company.com',
    password: 'password123',
    role: 'employee'
  }
];

async function addLoginUsers() {
  console.log('🚀 Adding login users to database...');
  
  for (const user of users) {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/register`, {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role
      });
      
      console.log(`✅ Created user: ${user.email} (${user.role})`);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log(`⚠️  User already exists: ${user.email}`);
      } else {
        console.log(`❌ Error creating ${user.email}: ${error.response?.data?.message || error.message}`);
      }
    }
  }
  
  console.log('\n🎉 Login users setup complete!');
  console.log('\n📋 Login Credentials:');
  console.log('Admin: admin@company.com / admin123');
  console.log('HR: hr@company.com / hr123');
  console.log('Employee: john.doe@company.com / password123');
}

// Run the function
addLoginUsers().catch(console.error); 
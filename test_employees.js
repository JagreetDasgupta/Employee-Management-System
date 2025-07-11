import axios from 'axios';

const BASE_URL = 'https://employee-management-system-c5qp.onrender.com';

async function testEmployees() {
  console.log('🔍 Testing employees endpoint...');
  
  try {
    // Step 1: Login to get token
    console.log('\n1. Logging in to get token...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: 'admin@admin.com',
      password: 'admin'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Login successful, got token');
    
    // Step 2: Test employees endpoint with token
    console.log('\n2. Testing employees endpoint with token...');
    const employeesResponse = await axios.get(`${BASE_URL}/api/employees`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Employees endpoint successful!');
    console.log('Response status:', employeesResponse.status);
    console.log('Number of employees:', employeesResponse.data.employees?.length || 0);
    console.log('Sample employee:', employeesResponse.data.employees?.[0]);
    
  } catch (error) {
    console.log('❌ Error:');
    console.log('Status:', error.response?.status);
    console.log('Data:', error.response?.data);
    console.log('Message:', error.message);
  }
}

testEmployees().catch(console.error); 
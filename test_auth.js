import axios from 'axios';

const BASE_URL = 'https://employee-management-system-c5qp.onrender.com';

async function testAuth() {
  console.log('🔍 Testing auth endpoint...');
  
  try {
    // Test 1: Check if endpoint exists
    console.log('\n1. Testing endpoint availability...');
    const response = await axios.get(`${BASE_URL}/api/auth`);
    console.log('✅ Auth endpoint is accessible');
  } catch (error) {
    console.log('❌ Auth endpoint error:', error.response?.status, error.response?.data);
  }
  
  try {
    // Test 2: Try to register a user
    console.log('\n2. Testing user registration...');
    const registerData = {
      username: 'test@test.com',
      password: 'test123',
      role: 'admin'
    };
    
    console.log('Sending data:', registerData);
    
    const response = await axios.post(`${BASE_URL}/api/auth/register`, registerData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Registration successful:', response.data);
  } catch (error) {
    console.log('❌ Registration failed:');
    console.log('Status:', error.response?.status);
    console.log('Data:', error.response?.data);
    console.log('Message:', error.message);
  }
}

testAuth().catch(console.error); 
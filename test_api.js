import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// Test data
const testUser = {
  username: 'admin_user',
  password: 'password123',
  role: 'admin'
};

const testEmployee = {
  employeeId: 'EMP001',
  name: 'John Doe',
  email: 'john.doe@company.com',
  phone: '+1234567890',
  department: 'IT',
  designation: 'Software Developer',
  joiningDate: '2023-01-15',
  salary: 75000,
  status: 'active'
};

let authToken = '';

// Helper function to make API calls
async function makeRequest(url, options = {}) {
  try {
    const response = await axios({
      url,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      data: options.body ? options.body : undefined,
      validateStatus: () => true
    });
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error('Request failed:', error.message);
    return { status: 0, data: { error: error.message } };
  }
}

// Test functions
async function testRegister() {
  console.log('\n=== Testing User Registration ===');
  const result = await makeRequest(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    body: testUser
  });
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  return result;
}

async function testLogin() {
  console.log('\n=== Testing User Login ===');
  const result = await makeRequest(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    body: {
      username: testUser.username,
      password: testUser.password
    }
  });
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.data.success && result.data.data.token) {
    authToken = result.data.data.token;
    console.log('✅ Token obtained successfully');
  }
  
  return result;
}

async function testCreateEmployee() {
  console.log('\n=== Testing Create Employee ===');
  const result = await makeRequest(`${BASE_URL}/api/employees`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: testEmployee
  });
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  return result;
}

async function testGetAllEmployees() {
  console.log('\n=== Testing Get All Employees ===');
  const result = await makeRequest(`${BASE_URL}/api/employees`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  return result;
}

async function testGetEmployeeById(employeeId) {
  console.log('\n=== Testing Get Employee by ID ===');
  const result = await makeRequest(`${BASE_URL}/api/employees/${employeeId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  return result;
}

async function testUpdateEmployee(employeeId) {
  console.log('\n=== Testing Update Employee ===');
  const updateData = {
    salary: 80000,
    status: 'active'
  };
  
  const result = await makeRequest(`${BASE_URL}/api/employees/${employeeId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: updateData
  });
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  return result;
}

async function testDeleteEmployee(employeeId) {
  console.log('\n=== Testing Delete Employee ===');
  const result = await makeRequest(`${BASE_URL}/api/employees/${employeeId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  return result;
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Employee Management API Tests...\n');
  
  // Test 1: Register user
  const registerResult = await testRegister();
  if (registerResult.status !== 201 && registerResult.status !== 409) {
    console.log('❌ Registration failed');
    return;
  }
  
  // Test 2: Login
  const loginResult = await testLogin();
  if (loginResult.status !== 200) {
    console.log('❌ Login failed');
    return;
  }
  
  // Test 3: Create employee
  const createResult = await testCreateEmployee();
  if (createResult.status !== 201) {
    console.log('❌ Create employee failed');
    return;
  }
  
  const employeeId = createResult.data.data._id;
  
  // Test 4: Get all employees
  await testGetAllEmployees();
  
  // Test 5: Get employee by ID
  await testGetEmployeeById(employeeId);
  
  // Test 6: Update employee
  await testUpdateEmployee(employeeId);
  
  // Test 7: Delete employee
  await testDeleteEmployee(employeeId);
  
  console.log('\n✅ All tests completed!');
}

// Run the tests
runTests().catch(console.error); 
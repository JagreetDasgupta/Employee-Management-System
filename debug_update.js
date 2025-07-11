import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

let authToken = '';

// Helper function to make API calls
async function makeRequest(url, options = {}) {
  try {
    const response = await axios({
      url,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        ...(options.headers || {})
      },
      data: options.body ? options.body : undefined,
      validateStatus: () => true
    });
    
    return { status: response.status, data: response.data };
  } catch (error) {
    console.error('Request failed:', error.message);
    return { status: 500, data: { error: error.message } };
  }
}

// Test functions
async function testAuthentication() {
  console.log('\n=== Testing Authentication ===');
  
  // Login
  const loginResult = await makeRequest(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    body: {
      username: 'admin',
      password: 'admin123'
    }
  });
  
  if (loginResult.status === 200) {
    authToken = loginResult.data.data.token;
    console.log('✅ Login: Success, token obtained');
  } else {
    console.log('❌ Login:', loginResult.status, loginResult.data.message || loginResult.data.error);
  }
}

async function testEmployeeUpdate() {
  console.log('\n=== Testing Employee Update ===');
  
  // First, get existing employees
  console.log('\n1. Getting existing employees:');
  const getEmployeesResult = await makeRequest(`${BASE_URL}/api/employees?limit=1`);
  console.log('Get employees:', getEmployeesResult.status);
  
  if (getEmployeesResult.status === 200 && getEmployeesResult.data.data.length > 0) {
    const employee = getEmployeesResult.data.data[0];
    const employeeId = employee._id;
    
    console.log('✅ Found employee:', employee.name, '(ID:', employeeId, ')');
    console.log('Current data:', {
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      address: employee.address
    });
    
    // Test update
    console.log('\n2. Testing employee update:');
    const updateData = {
      employeeId: employee.employeeId,
      name: employee.name + ' (Updated)',
      email: employee.email,
      phone: employee.phone || '+1234567890', // Ensure phone is provided
      department: employee.department,
      designation: employee.designation,
      joiningDate: employee.joiningDate,
      salary: employee.salary,
      status: employee.status,
      address: employee.address + ' (Updated)'
    };
    
    console.log('Update payload:', updateData);
    
    const updateResult = await makeRequest(`${BASE_URL}/api/employees/${employeeId}`, {
      method: 'PUT',
      body: updateData
    });
    
    console.log('Update result:', updateResult.status);
    if (updateResult.status === 200) {
      console.log('✅ Update successful:', updateResult.data.message);
      console.log('Updated data:', updateResult.data.data);
    } else {
      console.log('❌ Update failed:', updateResult.data.message);
      if (updateResult.data.errors) {
        console.log('Validation errors:', updateResult.data.errors);
      }
    }
    
    // Verify update
    console.log('\n3. Verifying update:');
    const verifyResult = await makeRequest(`${BASE_URL}/api/employees/${employeeId}`);
    if (verifyResult.status === 200) {
      const updatedEmployee = verifyResult.data.data;
      console.log('✅ Verification successful');
      console.log('Updated employee:', {
        name: updatedEmployee.name,
        email: updatedEmployee.email,
        phone: updatedEmployee.phone,
        address: updatedEmployee.address
      });
    } else {
      console.log('❌ Verification failed:', verifyResult.data.message);
    }
    
  } else {
    console.log('❌ No employees found to test with');
  }
}

async function runDebug() {
  await testAuthentication();
  await testEmployeeUpdate();
  
  console.log('\n=== Debug Summary ===');
  console.log('Debug completed. Check the output above for any issues.');
}

runDebug(); 
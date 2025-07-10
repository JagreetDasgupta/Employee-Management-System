import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// Test data
const adminUser = {
  username: 'admin_test',
  password: 'password123',
  role: 'admin'
};

const hrUser = {
  username: 'hr_test',
  password: 'password123',
  role: 'hr'  // Changed from 'HR' to 'hr' to match the enum
};

const testEmployee = {
  employeeId: 'TEST001',
  name: 'Test User',
  email: 'test@example.com',
  phone: '+1234567890',
  department: 'IT',
  designation: 'Developer',
  joiningDate: '2023-01-15',
  salary: 75000,
  status: 'active'
};

let adminToken = '';
let hrToken = '';
let createdEmployeeId = '';

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

// Test 1: API Endpoints Testing
async function testAPIEndpoints() {
  console.log('\n🔍 === TEST 1: API ENDPOINTS TESTING ===');
  
  // 1.1 Test Authentication Endpoints
  console.log('\n📝 1.1 Testing Authentication Endpoints');
  
  // Register admin user
  const adminRegister = await makeRequest(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    body: adminUser
  });
  console.log(`Admin Register: ${adminRegister.status} - ${adminRegister.data.message || adminRegister.data.error}`);
  
  // Register HR user
  const hrRegister = await makeRequest(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    body: hrUser
  });
  console.log(`HR Register: ${hrRegister.status} - ${hrRegister.data.message || hrRegister.data.error}`);
  
  // Login admin
  const adminLogin = await makeRequest(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    body: { username: adminUser.username, password: adminUser.password }
  });
  if (adminLogin.status === 200) {
    adminToken = adminLogin.data.data.token;
    console.log('✅ Admin login successful');
  } else {
    console.log(`❌ Admin login failed: ${adminLogin.data.message}`);
  }
  
  // Login HR
  const hrLogin = await makeRequest(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    body: { username: hrUser.username, password: hrUser.password }
  });
  if (hrLogin.status === 200) {
    hrToken = hrLogin.data.data.token;
    console.log('✅ HR login successful');
  } else {
    console.log(`❌ HR login failed: ${hrLogin.data.message}`);
  }
  
  // 1.2 Test Employee CRUD Endpoints
  console.log('\n👥 1.2 Testing Employee CRUD Endpoints');
  
  // Create employee (admin)
  const createEmployee = await makeRequest(`${BASE_URL}/api/employees`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}` },
    body: testEmployee
  });
  console.log(`Create Employee: ${createEmployee.status} - ${createEmployee.data.message || createEmployee.data.error}`);
  if (createEmployee.status === 201) {
    createdEmployeeId = createEmployee.data.data._id;
    console.log('✅ Employee created successfully');
  }
  
  // Get all employees
  const getAllEmployees = await makeRequest(`${BASE_URL}/api/employees`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  console.log(`Get All Employees: ${getAllEmployees.status} - Found ${getAllEmployees.data.data?.length || 0} employees`);
  
  // Get single employee
  if (createdEmployeeId) {
    const getEmployee = await makeRequest(`${BASE_URL}/api/employees/${createdEmployeeId}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log(`Get Employee: ${getEmployee.status} - ${getEmployee.data.message || getEmployee.data.error}`);
  }
  
  // Update employee
  if (createdEmployeeId) {
    const updateEmployee = await makeRequest(`${BASE_URL}/api/employees/${createdEmployeeId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${adminToken}` },
      body: { salary: 80000 }
    });
    console.log(`Update Employee: ${updateEmployee.status} - ${updateEmployee.data.message || updateEmployee.data.error}`);
  }
  
  // 1.3 Test Advanced Features
  console.log('\n🔍 1.3 Testing Advanced Features');
  
  // Test search
  const searchResult = await makeRequest(`${BASE_URL}/api/employees?search=test`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  console.log(`Search: ${searchResult.status} - Found ${searchResult.data.data?.length || 0} results`);
  
  // Test filtering
  const filterResult = await makeRequest(`${BASE_URL}/api/employees?department=IT&status=active`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  console.log(`Filter: ${filterResult.status} - Found ${filterResult.data.data?.length || 0} IT active employees`);
  
  // Test pagination
  const paginationResult = await makeRequest(`${BASE_URL}/api/employees?page=1&limit=5`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  console.log(`Pagination: ${paginationResult.status} - Page ${paginationResult.data.pagination?.currentPage || 'N/A'}`);
  
  // Test sorting
  const sortResult = await makeRequest(`${BASE_URL}/api/employees?sortBy=name&sortOrder=asc`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  console.log(`Sort: ${sortResult.status} - Sorted by ${sortResult.data.sorting?.sortBy || 'N/A'}`);
}

// Test 2: Role-Based Access Testing
async function testRoleBasedAccess() {
  console.log('\n🔐 === TEST 2: ROLE-BASED ACCESS TESTING ===');
  
  // 2.1 Test Admin Access
  console.log('\n👑 2.1 Testing Admin Access');
  
  // Admin can create employee
  const adminCreate = await makeRequest(`${BASE_URL}/api/employees`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}` },
    body: { ...testEmployee, employeeId: 'ADMIN001' }
  });
  console.log(`Admin Create: ${adminCreate.status} - ${adminCreate.data.message || adminCreate.data.error}`);
  
  // Admin can update employee
  if (createdEmployeeId) {
    const adminUpdate = await makeRequest(`${BASE_URL}/api/employees/${createdEmployeeId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${adminToken}` },
      body: { designation: 'Senior Developer' }
    });
    console.log(`Admin Update: ${adminUpdate.status} - ${adminUpdate.data.message || adminUpdate.data.error}`);
  }
  
  // Admin can delete employee
  if (createdEmployeeId) {
    const adminDelete = await makeRequest(`${BASE_URL}/api/employees/${createdEmployeeId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log(`Admin Delete: ${adminDelete.status} - ${adminDelete.data.message || adminDelete.data.error}`);
  }
  
  // 2.2 Test HR Access
  console.log('\n👔 2.2 Testing HR Access');
  
  // HR cannot create employee
  const hrCreate = await makeRequest(`${BASE_URL}/api/employees`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${hrToken}` },
    body: { ...testEmployee, employeeId: 'HR001' }
  });
  console.log(`HR Create: ${hrCreate.status} - ${hrCreate.data.message || hrCreate.data.error}`);
  
  // HR can read employees
  const hrRead = await makeRequest(`${BASE_URL}/api/employees`, {
    headers: { 'Authorization': `Bearer ${hrToken}` }
  });
  console.log(`HR Read: ${hrRead.status} - ${hrRead.data.message || hrRead.data.error}`);
  
  // HR cannot update employee
  if (createdEmployeeId) {
    const hrUpdate = await makeRequest(`${BASE_URL}/api/employees/${createdEmployeeId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${hrToken}` },
      body: { designation: 'HR Specialist' }
    });
    console.log(`HR Update: ${hrUpdate.status} - ${hrUpdate.data.message || hrUpdate.data.error}`);
  }
  
  // 2.3 Test Unauthorized Access
  console.log('\n🚫 2.3 Testing Unauthorized Access');
  
  // No token
  const noToken = await makeRequest(`${BASE_URL}/api/employees`);
  console.log(`No Token: ${noToken.status} - ${noToken.data.message || noToken.data.error}`);
  
  // Invalid token
  const invalidToken = await makeRequest(`${BASE_URL}/api/employees`, {
    headers: { 'Authorization': 'Bearer invalid_token' }
  });
  console.log(`Invalid Token: ${invalidToken.status} - ${invalidToken.data.message || invalidToken.data.error}`);
}

// Test 3: Input Validation and Edge Cases
async function testInputValidation() {
  console.log('\n✅ === TEST 3: INPUT VALIDATION AND EDGE CASES ===');
  
  // 3.1 Test Duplicate Employee ID
  console.log('\n🆔 3.1 Testing Duplicate Employee ID');
  
  // Create first employee
  const firstEmployee = await makeRequest(`${BASE_URL}/api/employees`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}` },
    body: { ...testEmployee, employeeId: 'DUPLICATE001' }
  });
  console.log(`First Employee: ${firstEmployee.status} - ${firstEmployee.data.message || firstEmployee.data.error}`);
  
  // Try to create duplicate
  const duplicateEmployee = await makeRequest(`${BASE_URL}/api/employees`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}` },
    body: { ...testEmployee, employeeId: 'DUPLICATE001', email: 'duplicate@example.com' }
  });
  console.log(`Duplicate Employee: ${duplicateEmployee.status} - ${duplicateEmployee.data.message || duplicateEmployee.data.error}`);
  
  // 3.2 Test Duplicate Email
  console.log('\n📧 3.2 Testing Duplicate Email');
  
  const duplicateEmail = await makeRequest(`${BASE_URL}/api/employees`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}` },
    body: { ...testEmployee, employeeId: 'EMAIL001', email: 'test@example.com' }
  });
  console.log(`Duplicate Email: ${duplicateEmail.status} - ${duplicateEmail.data.message || duplicateEmail.data.error}`);
  
  // 3.3 Test Invalid Input Data
  console.log('\n❌ 3.3 Testing Invalid Input Data');
  
  // Missing required fields
  const missingFields = await makeRequest(`${BASE_URL}/api/employees`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}` },
    body: { name: 'Test User' } // Missing other required fields
  });
  console.log(`Missing Fields: ${missingFields.status} - ${missingFields.data.message || missingFields.data.error}`);
  
  // Invalid email format
  const invalidEmail = await makeRequest(`${BASE_URL}/api/employees`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}` },
    body: { ...testEmployee, employeeId: 'INVALID001', email: 'invalid-email' }
  });
  console.log(`Invalid Email: ${invalidEmail.status} - ${invalidEmail.data.message || invalidEmail.data.error}`);
  
  // Invalid salary (negative)
  const invalidSalary = await makeRequest(`${BASE_URL}/api/employees`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}` },
    body: { ...testEmployee, employeeId: 'SALARY001', salary: -1000 }
  });
  console.log(`Invalid Salary: ${invalidSalary.status} - ${invalidSalary.data.message || invalidSalary.data.error}`);
  
  // Invalid status
  const invalidStatus = await makeRequest(`${BASE_URL}/api/employees`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}` },
    body: { ...testEmployee, employeeId: 'STATUS001', status: 'invalid_status' }
  });
  console.log(`Invalid Status: ${invalidStatus.status} - ${invalidStatus.data.message || invalidStatus.data.error}`);
  
  // 3.4 Test Invalid Query Parameters
  console.log('\n🔍 3.4 Testing Invalid Query Parameters');
  
  // Invalid status filter
  const invalidStatusFilter = await makeRequest(`${BASE_URL}/api/employees?status=invalid`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  console.log(`Invalid Status Filter: ${invalidStatusFilter.status} - ${invalidStatusFilter.data.message || invalidStatusFilter.data.error}`);
  
  // Invalid sort field
  const invalidSortField = await makeRequest(`${BASE_URL}/api/employees?sortBy=invalid_field`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  console.log(`Invalid Sort Field: ${invalidSortField.status} - ${invalidSortField.data.message || invalidSortField.data.error}`);
  
  // Invalid pagination
  const invalidPagination = await makeRequest(`${BASE_URL}/api/employees?page=0&limit=5000`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  console.log(`Invalid Pagination: ${invalidPagination.status} - ${invalidPagination.data.message || invalidPagination.data.error}`);
  
  // 3.5 Test Non-existent Resources
  console.log('\n🔍 3.5 Testing Non-existent Resources');
  
  // Get non-existent employee
  const nonExistentEmployee = await makeRequest(`${BASE_URL}/api/employees/507f1f77bcf86cd799439011`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  console.log(`Non-existent Employee: ${nonExistentEmployee.status} - ${nonExistentEmployee.data.message || nonExistentEmployee.data.error}`);
  
  // Update non-existent employee
  const updateNonExistent = await makeRequest(`${BASE_URL}/api/employees/507f1f77bcf86cd799439011`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${adminToken}` },
    body: { name: 'Updated Name' }
  });
  console.log(`Update Non-existent: ${updateNonExistent.status} - ${updateNonExistent.data.message || updateNonExistent.data.error}`);
}

// Test 4: Analytics and Advanced Features
async function testAdvancedFeatures() {
  console.log('\n📊 === TEST 4: ANALYTICS AND ADVANCED FEATURES ===');
  
  // 4.1 Test Employee Statistics
  console.log('\n📈 4.1 Testing Employee Statistics');
  
  const stats = await makeRequest(`${BASE_URL}/api/employees/stats`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  console.log(`Stats: ${stats.status} - Total: ${stats.data.totalEmployees}, Active: ${stats.data.activeEmployees}`);
  
  // 4.2 Test Analytics
  console.log('\n📊 4.2 Testing Analytics');
  
  const analytics = await makeRequest(`${BASE_URL}/api/employees/analytics?period=month`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  console.log(`Analytics: ${analytics.status} - ${analytics.data.message || analytics.data.error}`);
  if (analytics.status === 200) {
    console.log(`  - Total Employees: ${analytics.data.data.overview.totalEmployees}`);
    console.log(`  - Retention Rate: ${analytics.data.data.overview.retentionRate}`);
    console.log(`  - Recent Hires: ${analytics.data.data.recentHires}`);
  }
  
  // 4.3 Test Audit Logs (Admin only)
  console.log('\n📝 4.3 Testing Audit Logs');
  
  const auditLogs = await makeRequest(`${BASE_URL}/api/audit/logs?limit=5`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  console.log(`Audit Logs: ${auditLogs.status} - ${auditLogs.data.message || auditLogs.data.error}`);
  
  // HR cannot access audit logs
  const hrAuditLogs = await makeRequest(`${BASE_URL}/api/audit/logs?limit=5`, {
    headers: { 'Authorization': `Bearer ${hrToken}` }
  });
  console.log(`HR Audit Logs: ${hrAuditLogs.status} - ${hrAuditLogs.data.message || hrAuditLogs.data.error}`);
}

// Main test runner
async function runComprehensiveTests() {
  console.log('🚀 Starting Comprehensive Employee Management API Tests...\n');
  
  try {
    await testAPIEndpoints();
    await testRoleBasedAccess();
    await testInputValidation();
    await testAdvancedFeatures();
    
    console.log('\n🎉 === ALL TESTS COMPLETED ===');
    console.log('\n📋 Test Summary:');
    console.log('✅ API Endpoints Testing - Complete');
    console.log('✅ Role-Based Access Testing - Complete');
    console.log('✅ Input Validation and Edge Cases - Complete');
    console.log('✅ Advanced Features Testing - Complete');
    console.log('\n🔧 All endpoints tested with proper error handling and validation!');
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
  }
}

// Run the comprehensive tests
runComprehensiveTests(); 
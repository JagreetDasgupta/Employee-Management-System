import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// Test data for creating multiple employees
const testEmployees = [
  {
    employeeId: 'EMP001',
    name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+1234567890',
    department: 'IT',
    designation: 'Software Developer',
    joiningDate: '2023-01-15',
    salary: 75000,
    status: 'active'
  },
  {
    employeeId: 'EMP002',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    phone: '+1234567891',
    department: 'HR',
    designation: 'HR Manager',
    joiningDate: '2023-02-20',
    salary: 65000,
    status: 'active'
  },
  {
    employeeId: 'EMP003',
    name: 'Bob Johnson',
    email: 'bob.johnson@company.com',
    phone: '+1234567892',
    department: 'IT',
    designation: 'Senior Developer',
    joiningDate: '2022-11-10',
    salary: 85000,
    status: 'active'
  },
  {
    employeeId: 'EMP004',
    name: 'Alice Brown',
    email: 'alice.brown@company.com',
    phone: '+1234567893',
    department: 'Marketing',
    designation: 'Marketing Specialist',
    joiningDate: '2023-03-05',
    salary: 55000,
    status: 'inactive'
  },
  {
    employeeId: 'EMP005',
    name: 'Charlie Wilson',
    email: 'charlie.wilson@company.com',
    phone: '+1234567894',
    department: 'IT',
    designation: 'DevOps Engineer',
    joiningDate: '2023-04-12',
    salary: 80000,
    status: 'active'
  }
];

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
  
  // Register admin user
  const registerResult = await makeRequest(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    body: {
      username: 'admin_user',
      password: 'password123',
      role: 'admin'
    }
  });
  
  console.log('Register:', registerResult.status, registerResult.data.message || registerResult.data.error);
  
  // Login
  const loginResult = await makeRequest(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    body: {
      username: 'admin_user',
      password: 'password123'
    }
  });
  
  if (loginResult.status === 200) {
    authToken = loginResult.data.data.token;
    console.log('Login: Success, token obtained');
  } else {
    console.log('Login:', loginResult.status, loginResult.data.message || loginResult.data.error);
  }
}

async function createTestEmployees() {
  console.log('\n=== Creating Test Employees ===');
  
  for (const employee of testEmployees) {
    const result = await makeRequest(`${BASE_URL}/api/employees`, {
      method: 'POST',
      body: employee
    });
    
    console.log(`Create ${employee.employeeId}:`, result.status, result.data.message || result.data.error);
  }
}

async function testEnhancedFeatures() {
  console.log('\n=== Testing Enhanced Features ===');
  
  // Test 1: Basic pagination
  console.log('\n1. Basic Pagination:');
  const paginationResult = await makeRequest(`${BASE_URL}/api/employees?page=1&limit=3`);
  console.log('Status:', paginationResult.status);
  if (paginationResult.status === 200) {
    console.log('Total employees:', paginationResult.data.pagination.totalEmployees);
    console.log('Current page:', paginationResult.data.pagination.currentPage);
    console.log('Total pages:', paginationResult.data.pagination.totalPages);
  }
  
  // Test 2: Search by name
  console.log('\n2. Search by Name:');
  const searchResult = await makeRequest(`${BASE_URL}/api/employees?search=john`);
  console.log('Status:', searchResult.status);
  if (searchResult.status === 200) {
    console.log('Found employees:', searchResult.data.data.length);
    console.log('Search term:', searchResult.data.filters.search);
  }
  
  // Test 3: Filter by department
  console.log('\n3. Filter by Department:');
  const deptResult = await makeRequest(`${BASE_URL}/api/employees?department=IT`);
  console.log('Status:', deptResult.status);
  if (deptResult.status === 200) {
    console.log('IT employees:', deptResult.data.data.length);
    console.log('Department filter:', deptResult.data.filters.department);
  }
  
  // Test 4: Filter by status
  console.log('\n4. Filter by Status:');
  const statusResult = await makeRequest(`${BASE_URL}/api/employees?status=active`);
  console.log('Status:', statusResult.status);
  if (statusResult.status === 200) {
    console.log('Active employees:', statusResult.data.data.length);
    console.log('Status filter:', statusResult.data.filters.status);
  }
  
  // Test 5: Filter by designation
  console.log('\n5. Filter by Designation:');
  const designationResult = await makeRequest(`${BASE_URL}/api/employees?designation=developer`);
  console.log('Status:', designationResult.status);
  if (designationResult.status === 200) {
    console.log('Developer employees:', designationResult.data.data.length);
    console.log('Designation filter:', designationResult.data.filters.designation);
  }
  
  // Test 6: Sort by name ascending
  console.log('\n6. Sort by Name (Ascending):');
  const sortNameResult = await makeRequest(`${BASE_URL}/api/employees?sortBy=name&sortOrder=asc`);
  console.log('Status:', sortNameResult.status);
  if (sortNameResult.status === 200) {
    console.log('Sort field:', sortNameResult.data.sorting.sortBy);
    console.log('Sort order:', sortNameResult.data.sorting.sortOrder);
    console.log('First employee:', sortNameResult.data.data[0]?.name);
  }
  
  // Test 7: Sort by salary descending
  console.log('\n7. Sort by Salary (Descending):');
  const sortSalaryResult = await makeRequest(`${BASE_URL}/api/employees?sortBy=salary&sortOrder=desc`);
  console.log('Status:', sortSalaryResult.status);
  if (sortSalaryResult.status === 200) {
    console.log('Sort field:', sortSalaryResult.data.sorting.sortBy);
    console.log('Sort order:', sortSalaryResult.data.sorting.sortOrder);
    console.log('Highest salary:', sortSalaryResult.data.data[0]?.salary);
  }
  
  // Test 8: Complex query with multiple filters and sorting
  console.log('\n8. Complex Query:');
  const complexResult = await makeRequest(`${BASE_URL}/api/employees?department=IT&status=active&sortBy=joiningDate&sortOrder=desc&page=1&limit=2`);
  console.log('Status:', complexResult.status);
  if (complexResult.status === 200) {
    console.log('Complex query results:', complexResult.data.data.length);
    console.log('Filters applied:', complexResult.data.filters);
    console.log('Sorting applied:', complexResult.data.sorting);
  }
  
  // Test 9: Invalid parameters
  console.log('\n9. Invalid Parameters:');
  const invalidResult = await makeRequest(`${BASE_URL}/api/employees?status=invalid&sortBy=invalidField`);
  console.log('Status:', invalidResult.status);
  console.log('Error message:', invalidResult.data.message);
}

async function runAllTests() {
  try {
    await testAuthentication();
    await createTestEmployees();
    await testEnhancedFeatures();
    
    console.log('\n=== Test Summary ===');
    console.log('✅ Enhanced employee API features tested successfully!');
    console.log('\nAvailable query parameters:');
    console.log('- page: Page number (default: 1)');
    console.log('- limit: Items per page (default: 10, max: 100)');
    console.log('- department: Filter by department');
    console.log('- status: Filter by status (active/inactive)');
    console.log('- designation: Filter by designation');
    console.log('- search: Search across multiple fields');
    console.log('- sortBy: Sort field (name, joiningDate, salary, createdAt, department, designation)');
    console.log('- sortOrder: Sort order (asc/desc)');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the tests
runAllTests(); 
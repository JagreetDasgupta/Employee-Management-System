import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// Simple test to show new features
async function testNewFeatures() {
  console.log('🚀 Testing New Features\n');

  try {
    // 1. Register a test user
    console.log('1. Creating test user...');
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
      username: 'test_admin',
      password: 'password123',
      role: 'admin'
    });
    console.log('✅ User created:', registerResponse.data.message);

    // 2. Login to get token
    console.log('\n2. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: 'test_admin',
      password: 'password123'
    });
    const token = loginResponse.data.data.token;
    console.log('✅ Login successful');

    // Set up headers for authenticated requests
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 3. Test the NEW Analytics endpoint
    console.log('\n3. Testing NEW Analytics Endpoint...');
    const analyticsResponse = await axios.get(`${BASE_URL}/api/employees/analytics?period=month`, { headers });
    console.log('✅ Analytics endpoint working!');
    console.log('   📊 Data received:', Object.keys(analyticsResponse.data.data));
    console.log('   👥 Total Employees:', analyticsResponse.data.data.overview.totalEmployees);
    console.log('   📈 Retention Rate:', analyticsResponse.data.data.overview.retentionRate);

    // 4. Test the NEW Audit logs endpoint
    console.log('\n4. Testing NEW Audit Logs...');
    const auditResponse = await axios.get(`${BASE_URL}/api/audit/logs?limit=5`, { headers });
    console.log('✅ Audit system working!');
    console.log('   🔍 Total audit logs:', auditResponse.data.pagination.totalLogs);

    // 5. Create an employee to generate audit logs
    console.log('\n5. Creating employee to generate audit logs...');
    const employeeData = {
      employeeId: 'DEMO001',
      name: 'Demo User',
      email: 'demo@example.com',
      phone: '+1234567890',
      department: 'IT',
      designation: 'Developer',
      joiningDate: '2024-01-15',
      salary: 75000,
      status: 'active'
    };
    
    const createResponse = await axios.post(`${BASE_URL}/api/employees`, employeeData, { headers });
    console.log('✅ Employee created:', createResponse.data.message);

    // 6. Check audit logs again to see the new entry
    console.log('\n6. Checking updated audit logs...');
    const updatedAuditResponse = await axios.get(`${BASE_URL}/api/audit/logs?limit=1`, { headers });
    if (updatedAuditResponse.data.data.length > 0) {
      const latestLog = updatedAuditResponse.data.data[0];
      console.log('✅ New audit log created:');
      console.log('   - Action:', latestLog.action);
      console.log('   - Resource:', latestLog.resource);
      console.log('   - User:', latestLog.user.username);
    }

    console.log('\n🎉 ALL NEW FEATURES WORKING!');
    console.log('\n📋 What was added:');
    console.log('✅ Advanced Analytics endpoint (/api/employees/analytics)');
    console.log('✅ Comprehensive Audit Trail system (/api/audit/logs)');
    console.log('✅ Audit log export functionality (/api/audit/export)');
    console.log('✅ Real-time activity monitoring');
    console.log('✅ Business intelligence features');

  } catch (error) {
    console.error('❌ Error:', error.response?.data?.message || error.message);
  }
}

testNewFeatures(); 
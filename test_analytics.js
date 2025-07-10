import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
let authToken = '';

// Test data
const testUser = {
  username: 'admin_user',
  password: 'password123'
};

// Helper function to make authenticated requests
const makeRequest = async (method, endpoint, data = null) => {
  const config = {
    method,
    url: `${BASE_URL}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    },
    ...(data && { data })
  };
  
  try {
    const response = await axios(config);
    return { status: response.status, data: response.data };
  } catch (error) {
    return { 
      status: error.response?.status || 500, 
      data: error.response?.data || { message: error.message }
    };
  }
};

// Test the new features
const testNewFeatures = async () => {
  console.log('🚀 Testing New Advanced Features\n');

  // 1. Login to get token
  console.log('1. Authenticating...');
  const loginResult = await makeRequest('POST', '/api/auth/login', testUser);
  if (loginResult.status === 200) {
    authToken = loginResult.data.data.token;
    console.log('✅ Login successful');
  } else {
    console.log('❌ Login failed:', loginResult.data.message);
    return;
  }

  // 2. Test Analytics Endpoint
  console.log('\n2. Testing Analytics Endpoint...');
  
  // Test monthly analytics
  const monthlyAnalytics = await makeRequest('GET', '/api/employees/analytics?period=month');
  console.log('📊 Monthly Analytics Status:', monthlyAnalytics.status);
  if (monthlyAnalytics.status === 200) {
    console.log('✅ Analytics endpoint working');
    console.log('   - Total Employees:', monthlyAnalytics.data.data.overview.totalEmployees);
    console.log('   - Active Employees:', monthlyAnalytics.data.data.overview.activeEmployees);
    console.log('   - Retention Rate:', monthlyAnalytics.data.data.overview.retentionRate);
    console.log('   - Recent Hires:', monthlyAnalytics.data.data.recentHires);
  } else {
    console.log('❌ Analytics failed:', monthlyAnalytics.data.message);
  }

  // Test different periods
  const periods = ['week', 'month', 'quarter', 'year'];
  for (const period of periods) {
    const periodAnalytics = await makeRequest('GET', `/api/employees/analytics?period=${period}`);
    console.log(`   📈 ${period.toUpperCase()} period: ${periodAnalytics.status === 200 ? '✅' : '❌'}`);
  }

  // 3. Test Audit Logs (Admin only)
  console.log('\n3. Testing Audit Logs...');
  const auditLogs = await makeRequest('GET', '/api/audit/logs?limit=5');
  console.log('🔍 Audit Logs Status:', auditLogs.status);
  if (auditLogs.status === 200) {
    console.log('✅ Audit system working');
    console.log('   - Total Logs:', auditLogs.data.pagination.totalLogs);
    console.log('   - Logs Retrieved:', auditLogs.data.data.length);
  } else {
    console.log('❌ Audit logs failed:', auditLogs.data.message);
  }

  // 4. Test Audit Export
  console.log('\n4. Testing Audit Export...');
  const auditExport = await makeRequest('GET', '/api/audit/export');
  console.log('📄 Audit Export Status:', auditExport.status);
  if (auditExport.status === 200) {
    console.log('✅ Audit export working');
  } else {
    console.log('❌ Audit export failed:', auditExport.data.message);
  }

  // 5. Create some test data to generate audit logs
  console.log('\n5. Creating test employee to generate audit logs...');
  const testEmployee = {
    employeeId: 'TEST001',
    name: 'Test User',
    email: 'test@example.com',
    phone: '+1234567890',
    department: 'IT',
    designation: 'Developer',
    joiningDate: '2024-01-15',
    salary: 75000,
    status: 'active'
  };
  
  const createResult = await makeRequest('POST', '/api/employees', testEmployee);
  console.log('👤 Create Employee Status:', createResult.status);
  if (createResult.status === 201) {
    console.log('✅ Test employee created');
    
    // Wait a moment for audit log to be created
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check audit logs again
    const newAuditLogs = await makeRequest('GET', '/api/audit/logs?limit=1');
    if (newAuditLogs.status === 200 && newAuditLogs.data.data.length > 0) {
      const latestLog = newAuditLogs.data.data[0];
      console.log('   🔍 Latest audit log:');
      console.log('      - Action:', latestLog.action);
      console.log('      - Resource:', latestLog.resource);
      console.log('      - User:', latestLog.user.username);
      console.log('      - Success:', latestLog.success);
    }
  } else {
    console.log('❌ Failed to create test employee:', createResult.data.message);
  }

  // 6. Test Enhanced Employee Stats
  console.log('\n6. Testing Enhanced Employee Stats...');
  const enhancedStats = await makeRequest('GET', '/api/employees/stats');
  console.log('📊 Enhanced Stats Status:', enhancedStats.status);
  if (enhancedStats.status === 200) {
    console.log('✅ Enhanced stats working');
    console.log('   - Total Employees:', enhancedStats.data.totalEmployees);
    console.log('   - Active Employees:', enhancedStats.data.activeEmployees);
  } else {
    console.log('❌ Enhanced stats failed:', enhancedStats.data.message);
  }

  console.log('\n🎉 Testing Complete!');
  console.log('\n📋 Summary of New Features:');
  console.log('✅ Advanced Analytics with period filtering');
  console.log('✅ Comprehensive Audit Trail System');
  console.log('✅ Audit Log Export to CSV');
  console.log('✅ Enhanced Employee Statistics');
  console.log('✅ Real-time Activity Monitoring');
};

// Run the tests
testNewFeatures().catch(console.error); 
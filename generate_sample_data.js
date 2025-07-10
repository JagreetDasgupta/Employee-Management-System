import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// Sample data for generating employees
const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations', 'Engineering', 'Design'];
const designations = {
  'IT': ['Software Developer', 'Senior Developer', 'DevOps Engineer', 'QA Engineer', 'System Administrator'],
  'HR': ['HR Manager', 'HR Specialist', 'Recruiter', 'Training Coordinator'],
  'Finance': ['Financial Analyst', 'Accountant', 'Finance Manager', 'Budget Analyst'],
  'Marketing': ['Marketing Specialist', 'Marketing Manager', 'Content Creator', 'SEO Specialist'],
  'Sales': ['Sales Representative', 'Sales Manager', 'Account Executive', 'Business Development'],
  'Operations': ['Operations Manager', 'Operations Analyst', 'Process Coordinator'],
  'Engineering': ['Mechanical Engineer', 'Electrical Engineer', 'Civil Engineer', 'Project Engineer'],
  'Design': ['UI/UX Designer', 'Graphic Designer', 'Product Designer', 'Creative Director']
};

const firstNames = [
  'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jessica', 'William', 'Ashley',
  'James', 'Amanda', 'Christopher', 'Stephanie', 'Daniel', 'Nicole', 'Matthew', 'Elizabeth', 'Anthony', 'Helen',
  'Mark', 'Deborah', 'Donald', 'Lisa', 'Steven', 'Nancy', 'Paul', 'Karen', 'Andrew', 'Betty',
  'Joshua', 'Sandra', 'Kenneth', 'Donna', 'Kevin', 'Carol', 'Brian', 'Ruth', 'George', 'Sharon',
  'Timothy', 'Michelle', 'Ronald', 'Laura', 'Jason', 'Emily', 'Edward', 'Deborah', 'Jeffrey', 'Dorothy'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
];

const domains = ['company.com', 'techcorp.com', 'innovate.com', 'global.com', 'enterprise.com'];

// Generate random employee data
function generateEmployee(index) {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const department = departments[Math.floor(Math.random() * departments.length)];
  const designation = designations[department][Math.floor(Math.random() * designations[department].length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  
  // Generate realistic salary based on designation
  const baseSalaries = {
    'Software Developer': 70000,
    'Senior Developer': 95000,
    'DevOps Engineer': 85000,
    'QA Engineer': 65000,
    'System Administrator': 75000,
    'HR Manager': 80000,
    'HR Specialist': 55000,
    'Recruiter': 60000,
    'Training Coordinator': 50000,
    'Financial Analyst': 70000,
    'Accountant': 60000,
    'Finance Manager': 90000,
    'Budget Analyst': 65000,
    'Marketing Specialist': 55000,
    'Marketing Manager': 85000,
    'Content Creator': 50000,
    'SEO Specialist': 60000,
    'Sales Representative': 50000,
    'Sales Manager': 80000,
    'Account Executive': 70000,
    'Business Development': 75000,
    'Operations Manager': 85000,
    'Operations Analyst': 60000,
    'Process Coordinator': 55000,
    'Mechanical Engineer': 75000,
    'Electrical Engineer': 80000,
    'Civil Engineer': 70000,
    'Project Engineer': 75000,
    'UI/UX Designer': 65000,
    'Graphic Designer': 55000,
    'Product Designer': 70000,
    'Creative Director': 95000
  };
  
  const baseSalary = baseSalaries[designation] || 60000;
  const salary = baseSalary + Math.floor(Math.random() * 20000) - 10000; // ±10k variation
  
  // Generate joining date (within last 5 years)
  const joiningDate = new Date();
  joiningDate.setFullYear(joiningDate.getFullYear() - Math.floor(Math.random() * 5));
  joiningDate.setMonth(Math.floor(Math.random() * 12));
  joiningDate.setDate(Math.floor(Math.random() * 28) + 1);
  
  return {
    employeeId: `EMP${String(index + 1).padStart(3, '0')}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
    phone: `+1${Math.floor(Math.random() * 900000000) + 100000000}`,
    department,
    designation,
    joiningDate: joiningDate.toISOString().split('T')[0],
    salary: Math.max(40000, salary), // Minimum salary
    status: Math.random() > 0.1 ? 'active' : 'inactive' // 90% active
  };
}

// Generate and upload sample data
async function generateSampleData(count = 50) {
  console.log(`🚀 Generating ${count} sample employees...`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < count; i++) {
    try {
      const employee = generateEmployee(i);
      const response = await axios.post(`${BASE_URL}/api/employees`, employee, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_TOKEN_HERE' // You'll need to replace this with actual token
        }
      });
      
      if (response.status === 201) {
        successCount++;
        console.log(`✅ Created: ${employee.name} (${employee.employeeId})`);
      }
    } catch (error) {
      errorCount++;
      if (error.response?.status === 409) {
        console.log(`⚠️  Skipped: Employee already exists`);
      } else {
        console.log(`❌ Error: ${error.response?.data?.message || error.message}`);
      }
    }
    
    // Add small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n📊 Generation Complete!`);
  console.log(`✅ Successfully created: ${successCount} employees`);
  console.log(`❌ Errors: ${errorCount} employees`);
  console.log(`\n🎉 Your database now has sample data to test with!`);
}

// Instructions for usage
console.log(`
🎯 Sample Data Generator for Employee Management System
=====================================================

This script will generate realistic sample employee data for testing your system.

📋 Instructions:
1. Make sure your backend server is running on port 3000
2. Login to get your JWT token
3. Replace 'YOUR_TOKEN_HERE' in the script with your actual token
4. Run: node generate_sample_data.js

📊 What it generates:
- Realistic employee names and emails
- Proper department and designation combinations
- Realistic salary ranges based on roles
- Joining dates within the last 5 years
- 90% active employees, 10% inactive

💾 Database Capacity:
With your 500MB MongoDB Atlas plan, you can easily store:
- 50,000+ employees
- Years of historical data
- Multiple departments and locations

🚀 Ready to generate sample data!
`);

// Uncomment the line below to actually run the generator
// generateSampleData(50); 
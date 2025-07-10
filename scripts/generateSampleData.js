import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from '../models/Employee.js';
import User from '../models/User.js';

dotenv.config();

const sampleEmployees = [
  {
    employeeId: 'EMP001',
    name: 'John Smith',
    email: 'john.smith@company.com',
    phone: '1555010101',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    salary: 95000,
    joiningDate: '2022-03-15',
    status: 'active'
  },
  {
    employeeId: 'EMP002',
    name: 'Emily Johnson',
    email: 'emily.johnson@company.com',
    phone: '1555010303',
    department: 'Marketing',
    designation: 'Marketing Manager',
    salary: 85000,
    joiningDate: '2021-11-20',
    status: 'active'
  },
  {
    employeeId: 'EMP003',
    name: 'David Wilson',
    email: 'david.wilson@company.com',
    phone: '1555010505',
    department: 'Sales',
    designation: 'Sales Representative',
    salary: 65000,
    joiningDate: '2023-01-10',
    status: 'active'
  },
  {
    employeeId: 'EMP004',
    name: 'Sarah Davis',
    email: 'sarah.davis@company.com',
    phone: '1555010707',
    department: 'HR',
    designation: 'HR Specialist',
    salary: 70000,
    joiningDate: '2022-08-05',
    status: 'active'
  },
  {
    employeeId: 'EMP005',
    name: 'Michael Brown',
    email: 'michael.brown@company.com',
    phone: '1555010909',
    department: 'Finance',
    designation: 'Financial Analyst',
    salary: 75000,
    joiningDate: '2021-06-12',
    status: 'active'
  },
  {
    employeeId: 'EMP006',
    name: 'Lisa Garcia',
    email: 'lisa.garcia@company.com',
    phone: '1555011111',
    department: 'Design',
    designation: 'UI/UX Designer',
    salary: 80000,
    joiningDate: '2023-02-28',
    status: 'active'
  },
  {
    employeeId: 'EMP007',
    name: 'James Miller',
    email: 'james.miller@company.com',
    phone: '1555011313',
    department: 'Operations',
    designation: 'Operations Manager',
    salary: 90000,
    joiningDate: '2020-12-03',
    status: 'active'
  },
  {
    employeeId: 'EMP008',
    name: 'Jennifer Taylor',
    email: 'jennifer.taylor@company.com',
    phone: '1555011515',
    department: 'Engineering',
    designation: 'Product Manager',
    salary: 100000,
    joiningDate: '2022-05-18',
    status: 'active'
  },
  {
    employeeId: 'EMP009',
    name: 'Robert Anderson',
    email: 'robert.anderson@company.com',
    phone: '1555011717',
    department: 'Engineering',
    designation: 'Lead Engineer',
    salary: 110000,
    joiningDate: '2021-09-22',
    status: 'active'
  },
  {
    employeeId: 'EMP010',
    name: 'Amanda Martinez',
    email: 'amanda.martinez@company.com',
    phone: '1555011919',
    department: 'Marketing',
    designation: 'Content Creator',
    salary: 60000,
    joiningDate: '2023-04-14',
    status: 'active'
  }
];

const sampleUsers = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  },
  {
    username: 'hr_manager',
    password: 'hr123456',
    role: 'HR'
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for sample data generation');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const generateSampleData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Employee.deleteMany({});
    await User.deleteMany({});

    console.log('Cleared existing data');

    // Create sample users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${userData.username} (${userData.role})`);
    }

    // Create sample employees
    for (const employeeData of sampleEmployees) {
      const employee = new Employee(employeeData);
      await employee.save();
      console.log(`Created employee: ${employeeData.name}`);
    }

    console.log('\n✅ Sample data generated successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${createdUsers.length} users created`);
    console.log(`- ${sampleEmployees.length} employees created`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('Admin: admin / admin123');
    console.log('HR Manager: hr_manager / hr123456');

    process.exit(0);
  } catch (error) {
    console.error('Error generating sample data:', error);
    process.exit(1);
  }
};

generateSampleData(); 
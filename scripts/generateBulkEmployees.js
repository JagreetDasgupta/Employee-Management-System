import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import Employee from '../models/Employee.js';

dotenv.config();

// Departments and designations mapping for realism
const DEPARTMENTS = {
  Engineering: ['Software Engineer', 'Senior Engineer', 'Lead Engineer', 'Engineering Manager', 'DevOps Engineer', 'QA Engineer'],
  Marketing: ['Marketing Specialist', 'Content Creator', 'SEO Specialist', 'Marketing Manager', 'Social Media Manager'],
  Sales: ['Sales Representative', 'Account Executive', 'Sales Manager', 'Business Development'],
  HR: ['HR Specialist', 'Recruiter', 'HR Manager', 'Benefits Coordinator'],
  Finance: ['Accountant', 'Financial Analyst', 'Finance Manager', 'Controller'],
  Operations: ['Operations Specialist', 'Operations Manager', 'Project Manager', 'Coordinator'],
  Design: ['UI/UX Designer', 'Graphic Designer', 'Design Lead', 'Creative Director'],
  Product: ['Product Manager', 'Product Owner', 'Business Analyst', 'Product Analyst']
};

const ALL_DEPARTMENTS = Object.keys(DEPARTMENTS);

const generateEmployee = (index) => {
  // Unique employee ID like EMP010001
  const employeeId = `EMP${(index + 1).toString().padStart(5, '0')}`;

  const name = faker.person.fullName();
  const email = faker.internet.email({ firstName: name.split(' ')[0], lastName: name.split(' ')[1], provider: 'company.com' }).toLowerCase();
  const phone = faker.phone.number('+1##########');

  const department = faker.helpers.arrayElement(ALL_DEPARTMENTS);
  const designation = faker.helpers.arrayElement(DEPARTMENTS[department]);

  // Joining date within last 5 years
  const joiningDate = faker.date.between({ from: new Date(new Date().setFullYear(new Date().getFullYear() - 5)), to: new Date() });

  // Salary range depending on role
  const baseSalary = {
    Engineering: [60000, 150000],
    Marketing: [40000, 100000],
    Sales: [35000, 120000],
    HR: [35000, 90000],
    Finance: [50000, 120000],
    Operations: [40000, 110000],
    Design: [45000, 110000],
    Product: [60000, 140000]
  }[department];
  const salary = faker.number.int({ min: baseSalary[0], max: baseSalary[1] });

  const status = faker.datatype.boolean({ probability: 0.9 }) ? 'active' : 'inactive';

  const address = `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()} ${faker.location.zipCode()}, ${faker.location.country()}`;

  return {
    employeeId,
    name,
    email,
    phone,
    department,
    designation,
    joiningDate,
    salary,
    status,
    address
  };
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const generateBulkEmployees = async (count = 10000) => {
  try {
    await connectDB();

    console.log(`\n⚙️  Generating ${count} employees... This might take a moment.`);
    const employees = [];
    for (let i = 0; i < count; i++) {
      employees.push(generateEmployee(i));
    }

    console.log('🚀 Inserting into MongoDB...');
    await Employee.insertMany(employees, { ordered: false });

    console.log(`\n✅ Successfully inserted ${count} employees!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error inserting employees:', error);
    process.exit(1);
  }
};

// Run the script if executed directly
if (process.argv[1].includes('generateBulkEmployees')) {
  const countArg = parseInt(process.argv[2], 10);
  const total = !isNaN(countArg) && countArg > 0 ? countArg : 10000;
  generateBulkEmployees(total);
} 
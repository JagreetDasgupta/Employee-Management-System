import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import Employee from '../models/Employee.js';

dotenv.config();

// Departments and designations mapping for realism
const DEPARTMENTS = {
  Engineering: ['Software Engineer', 'Senior Engineer', 'Lead Engineer', 'Engineering Manager', 'DevOps Engineer', 'QA Engineer'],
  Sales: ['Sales Representative', 'Account Executive', 'Sales Manager', 'Business Development'],
  Marketing: ['Marketing Specialist', 'Content Creator', 'SEO Specialist', 'Marketing Manager', 'Social Media Manager'],
  Operations: ['Operations Specialist', 'Operations Manager', 'Project Manager', 'Coordinator'],
  Finance: ['Accountant', 'Financial Analyst', 'Finance Manager', 'Controller'],
  Design: ['UI/UX Designer', 'Graphic Designer', 'Design Lead', 'Creative Director'],
  Product: ['Product Manager', 'Product Owner', 'Business Analyst', 'Product Analyst'],
  HR: ['HR Specialist', 'Recruiter', 'HR Manager', 'Benefits Coordinator']
};

// Weighted department distribution (sum to 100)
const DEPARTMENT_WEIGHTS = [
  { name: 'Engineering', weight: 30 },
  { name: 'Sales', weight: 20 },
  { name: 'Marketing', weight: 12 },
  { name: 'Operations', weight: 10 },
  { name: 'Finance', weight: 8 },
  { name: 'Design', weight: 8 },
  { name: 'Product', weight: 7 },
  { name: 'HR', weight: 5 }
];

// Helper to pick a department by weight
function weightedRandomDepartment() {
  const total = DEPARTMENT_WEIGHTS.reduce((sum, d) => sum + d.weight, 0);
  const r = Math.random() * total;
  let acc = 0;
  for (const d of DEPARTMENT_WEIGHTS) {
    acc += d.weight;
    if (r < acc) return d.name;
  }
  return DEPARTMENT_WEIGHTS[DEPARTMENT_WEIGHTS.length - 1].name;
}

const generateEmployee = (index) => {
  // Unique employee ID like EMP010001
  const employeeId = `EMP${(index + 1).toString().padStart(5, '0')}`;

  const name = faker.person.fullName();
  const email = faker.internet.email({ firstName: name.split(' ')[0], lastName: name.split(' ')[1], provider: 'company.com' }).toLowerCase();
  const phone = faker.phone.number('+1##########');

  const department = weightedRandomDepartment();
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
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import Employee from '../models/Employee.js';

dotenv.config();

// Exact distribution provided by the user
const DISTRIBUTION = {
  Engineering: { total: 6474, active: 5869 },
  Operations: { total: 3700, active: 3353 },
  Sales: { total: 2775, active: 2512 },
  Marketing: { total: 1480, active: 1342 },
  HR: { total: 1110, active: 1006 },
  Finance: { total: 1110, active: 1006 },
  Design: { total: 1850, active: 1660 },
};

// Departments and designations mapping for realism (reuse from bulk generator)
const DEPARTMENTS = {
  Engineering: ['Software Engineer', 'Senior Engineer', 'Lead Engineer', 'Engineering Manager', 'DevOps Engineer', 'QA Engineer'],
  Sales: ['Sales Representative', 'Account Executive', 'Sales Manager', 'Business Development'],
  Marketing: ['Marketing Specialist', 'Content Creator', 'SEO Specialist', 'Marketing Manager', 'Social Media Manager'],
  Operations: ['Operations Specialist', 'Operations Manager', 'Project Manager', 'Coordinator'],
  Finance: ['Accountant', 'Financial Analyst', 'Finance Manager', 'Controller'],
  Design: ['UI/UX Designer', 'Graphic Designer', 'Design Lead', 'Creative Director'],
  HR: ['HR Specialist', 'Recruiter', 'HR Manager', 'Benefits Coordinator'],
};

// Helper: generate a single employee record
const generateEmployee = (index, department, status) => {
  const employeeId = `EMP${(index + 1).toString().padStart(6, '0')}`; // Up to 999,999

  const name = faker.person.fullName();
  const [firstName, lastName] = name.split(' ');

  const email = faker.internet.email({ firstName, lastName, provider: 'company.com' }).toLowerCase();
  const phone = faker.phone.number('+1##########');
  const designation = faker.helpers.arrayElement(DEPARTMENTS[department]);

  const joiningDate = faker.date.between({
    from: new Date(new Date().setFullYear(new Date().getFullYear() - 5)),
    to: new Date(),
  });

  const salaryRanges = {
    Engineering: [60000, 150000],
    Marketing: [40000, 100000],
    Sales: [35000, 120000],
    HR: [35000, 90000],
    Finance: [50000, 120000],
    Operations: [40000, 110000],
    Design: [45000, 110000],
  };
  const [minSalary, maxSalary] = salaryRanges[department];
  const salary = faker.number.int({ min: minSalary, max: maxSalary });

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
    address,
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

const seedExactDistribution = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🧹 Clearing existing employees collection...');
    await Employee.deleteMany({});

    const employeesToInsert = [];
    let globalIndex = 0;

    console.log('🎯 Generating employees for each department...');
    for (const [dept, { total, active }] of Object.entries(DISTRIBUTION)) {
      const inactive = total - active;

      // Generate active employees first
      for (let i = 0; i < active; i++) {
        employeesToInsert.push(generateEmployee(globalIndex++, dept, 'active'));
      }

      // Then inactive employees
      for (let i = 0; i < inactive; i++) {
        employeesToInsert.push(generateEmployee(globalIndex++, dept, 'inactive'));
      }

      console.log(`  • ${dept}: ${total} total (${active} active, ${inactive} inactive)`);
    }

    console.log(`\n🚀 Inserting ${employeesToInsert.length} employees into MongoDB...`);
    await Employee.insertMany(employeesToInsert, { ordered: false });

    console.log('\n✅ Database seeding complete! Exact distribution inserted.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

// Execute if run directly
if (process.argv[1].includes('generateSpecificDistribution')) {
  seedExactDistribution();
} 
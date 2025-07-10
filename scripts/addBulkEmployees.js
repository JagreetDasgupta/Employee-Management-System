import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from '../models/Employee.js';

dotenv.config();

const departments = [
  'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product'
];
const designations = {
  Engineering: ['Software Engineer', 'Senior Engineer', 'Lead Engineer', 'Engineering Manager'],
  Marketing: ['Marketing Specialist', 'Marketing Manager', 'Content Creator', 'SEO Specialist'],
  Sales: ['Sales Representative', 'Sales Manager', 'Account Executive', 'Business Development'],
  HR: ['HR Specialist', 'HR Manager', 'Recruiter', 'Benefits Coordinator'],
  Finance: ['Accountant', 'Financial Analyst', 'Finance Manager', 'Controller'],
  Operations: ['Operations Specialist', 'Operations Manager', 'Project Manager', 'Coordinator'],
  Design: ['UI/UX Designer', 'Graphic Designer', 'Design Lead', 'Creative Director'],
  Product: ['Product Manager', 'Product Owner', 'Business Analyst', 'Product Analyst']
};

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomName() {
  const first = [
    'John', 'Emily', 'David', 'Sarah', 'Michael', 'Lisa', 'James', 'Jennifer', 'Robert', 'Amanda',
    'Chris', 'Jessica', 'Brian', 'Ashley', 'Kevin', 'Laura', 'Daniel', 'Megan', 'Matthew', 'Rachel',
    'Samantha', 'Brandon', 'Olivia', 'Ethan', 'Sophia', 'Benjamin', 'Emma', 'Alexander', 'Ava', 'William',
    'Mia', 'Elijah', 'Charlotte', 'Logan', 'Amelia', 'Lucas', 'Harper', 'Mason', 'Ella', 'Jacob', 'Abigail'
  ];
  const last = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Anderson',
    'Taylor', 'Thomas', 'Moore', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Clark',
    'Lewis', 'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Scott', 'Green', 'Baker',
    'Adams', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker'
  ];
  return `${randomFromArray(first)} ${randomFromArray(last)}`;
}

function randomEmail(name, i) {
  return (
    name.toLowerCase().replace(/ /g, '.') +
    (i ? i : '') +
    '@company.com'
  );
}

function randomPhone() {
  return (
    '+1' +
    Math.floor(1000000000 + Math.random() * 9000000000).toString()
  );
}

function randomSalary() {
  return Math.floor(40000 + Math.random() * 90000);
}

function randomDate() {
  const start = new Date(2018, 0, 1).getTime();
  const end = new Date().getTime();
  return new Date(start + Math.random() * (end - start));
}

async function addBulkEmployees() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const count = await Employee.countDocuments();
    let added = 0;
    for (let i = 1; i <= 3000; i++) {
      const department = randomFromArray(departments);
      const designation = randomFromArray(designations[department]);
      const name = randomName();
      const employeeId = `EMP${(count + i).toString().padStart(5, '0')}`;
      const email = randomEmail(name, count + i);
      const phone = randomPhone();
      const salary = randomSalary();
      const joiningDate = randomDate();
      // Add more realistic status distribution
      let status = 'active';
      if (Math.random() < 0.15) status = 'inactive';
      if (Math.random() < 0.05) status = 'on leave'; // introduce a rare status for realism

      const employee = new Employee({
        employeeId,
        name,
        email,
        phone,
        department,
        designation,
        salary,
        joiningDate,
        status: status === 'on leave' ? 'inactive' : status // fallback for schema
      });
      try {
        await employee.save();
        added++;
        if (added % 100 === 0) console.log(`${added} employees added...`);
      } catch (err) {
        // Skip duplicates or validation errors
      }
    }
    console.log(`\n✅ Added ${added} new employees!`);
    process.exit(0);
  } catch (error) {
    console.error('Error adding employees:', error);
    process.exit(1);
  }
}

addBulkEmployees(); 
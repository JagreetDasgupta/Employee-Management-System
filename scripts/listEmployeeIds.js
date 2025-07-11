const mongoose = require('mongoose');
const Employee = require('../models/Employee');

const MONGODB_URI = process.env.MONGODB_URI || 'YOUR_MONGODB_ATLAS_URI_HERE';

async function listEmployeeIds() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const employees = await Employee.find({}, { _id: 1, employeeId: 1, name: 1 });
  employees.forEach(emp => {
    console.log(`_id: ${emp._id}, employeeId: ${emp.employeeId}, name: ${emp.name}`);
  });
  await mongoose.disconnect();
}

listEmployeeIds().catch(err => {
  console.error('Error listing employees:', err);
  process.exit(1);
}); 
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Employee Schema
const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  joiningDate: {
    type: Date,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

const Employee = mongoose.model('Employee', employeeSchema);

async function addSampleEmployees() {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    
    // Sample employees
    const sampleEmployees = [
      {
        employeeId: 'EMP001',
        name: 'John Smith',
        email: 'john.smith@company.com',
        phone: '+1234567890',
        department: 'Engineering',
        designation: 'Software Developer',
        joiningDate: new Date('2023-01-15'),
        salary: 75000,
        status: 'active'
      },
      {
        employeeId: 'EMP002',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        phone: '+1234567891',
        department: 'Marketing',
        designation: 'Marketing Manager',
        joiningDate: new Date('2023-02-20'),
        salary: 85000,
        status: 'active'
      },
      {
        employeeId: 'EMP003',
        name: 'Mike Davis',
        email: 'mike.davis@company.com',
        phone: '+1234567892',
        department: 'Sales',
        designation: 'Sales Representative',
        joiningDate: new Date('2023-03-10'),
        salary: 60000,
        status: 'active'
      },
      {
        employeeId: 'EMP004',
        name: 'Emily Wilson',
        email: 'emily.wilson@company.com',
        phone: '+1234567893',
        department: 'HR',
        designation: 'HR Specialist',
        joiningDate: new Date('2023-04-05'),
        salary: 65000,
        status: 'active'
      },
      {
        employeeId: 'EMP005',
        name: 'David Brown',
        email: 'david.brown@company.com',
        phone: '+1234567894',
        department: 'Finance',
        designation: 'Financial Analyst',
        joiningDate: new Date('2023-05-12'),
        salary: 70000,
        status: 'active'
      }
    ];
    
    console.log('🚀 Adding sample employees...');
    
    for (const employeeData of sampleEmployees) {
      try {
        // Check if employee already exists
        const existingEmployee = await Employee.findOne({ 
          $or: [
            { employeeId: employeeData.employeeId },
            { email: employeeData.email }
          ]
        });
        
        if (existingEmployee) {
          console.log(`⚠️  Employee already exists: ${employeeData.name}`);
          continue;
        }
        
        // Create employee
        const newEmployee = new Employee(employeeData);
        await newEmployee.save();
        console.log(`✅ Created employee: ${employeeData.name} (${employeeData.employeeId})`);
        
      } catch (error) {
        console.log(`❌ Error creating ${employeeData.name}:`, error.message);
      }
    }
    
    console.log('\n🎉 Sample employees added successfully!');
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the function
addSampleEmployees(); 
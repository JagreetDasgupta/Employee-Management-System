import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    enum: {
      values: ['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations', 'Engineering', 'Design'],
      message: 'Department must be one of: IT, HR, Finance, Marketing, Sales, Operations, Engineering, Design'
    }
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true,
    minlength: [2, 'Designation must be at least 2 characters long'],
    maxlength: [50, 'Designation cannot exceed 50 characters']
  },
  joiningDate: {
    type: Date,
    required: [true, 'Joining date is required'],
    default: Date.now,
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'Joining date cannot be in the future'
    }
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required'],
    min: [0, 'Salary cannot be negative'],
    max: [1000000, 'Salary cannot exceed 1,000,000']
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive'],
      message: 'Status must be either active or inactive'
    },
    default: 'active'
  }
}, {
  timestamps: true
});

// Virtual for employee age (based on joining date)
employeeSchema.virtual('yearsOfService').get(function() {
  const today = new Date();
  const joiningDate = this.joiningDate;
  const diffTime = Math.abs(today - joiningDate);
  const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
  return diffYears;
});

// Ensure virtual fields are serialized
employeeSchema.set('toJSON', { virtuals: true });
employeeSchema.set('toObject', { virtuals: true });

export default mongoose.model('Employee', employeeSchema); 
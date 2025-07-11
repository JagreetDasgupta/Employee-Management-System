import Employee from '../models/Employee.js';
import { createAuditMiddleware } from '../middleware/audit.js';

// Validation helper function
const validateEmployeeData = (data) => {
  const errors = [];
  
  // Required fields
  if (!data.employeeId || data.employeeId.trim() === '') {
    errors.push('Employee ID is required');
  }
  
  if (!data.name || data.name.trim() === '') {
    errors.push('Name is required');
  }
  
  if (!data.email || data.email.trim() === '') {
    errors.push('Email is required');
  } else {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Invalid email format');
    }
  }
  
  if (!data.phone || data.phone.trim() === '') {
    errors.push('Phone number is required');
  }
  
  if (!data.department || data.department.trim() === '') {
    errors.push('Department is required');
  }
  
  if (!data.designation || data.designation.trim() === '') {
    errors.push('Designation is required');
  }
  
  if (!data.joiningDate) {
    errors.push('Joining date is required');
  } else {
    const joiningDate = new Date(data.joiningDate);
    if (isNaN(joiningDate.getTime())) {
      errors.push('Invalid joining date format');
    }
  }
  
  if (!data.salary || isNaN(data.salary) || data.salary <= 0) {
    errors.push('Valid salary is required');
  }
  
  if (!data.status || !['active', 'inactive'].includes(data.status)) {
    errors.push('Status must be active or inactive');
  }
  
  return errors;
};

// Create employee (admin only)
export const createEmployee = async (req, res) => {
  // Apply audit middleware
  const auditMiddleware = createAuditMiddleware('CREATE', 'EMPLOYEE');
  
  return new Promise((resolve) => {
    auditMiddleware(req, res, async () => {
  try {
    // Validate input data
    const validationErrors = validateEmployeeData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Check if employee with same employeeId already exists
    const existingEmployee = await Employee.findOne({ employeeId: req.body.employeeId });
    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: 'Employee with this Employee ID already exists'
      });
    }

    // Check if employee with same email already exists
    const existingEmail = await Employee.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'Employee with this email already exists'
      });
    }

    // Create new employee
    const employee = new Employee(req.body);
    await employee.save();

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
      resolve();
    });
  });
};

// Get all employees (both roles)
export const getAllEmployees = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      department, 
      status, 
      search,
      designation,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Department filter
    if (department) {
      filter.department = { $regex: department, $options: 'i' };
    }
    
    // Status filter
    if (status) {
      if (!['active', 'inactive'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be either "active" or "inactive"'
        });
      }
      filter.status = status;
    }
    
    // Designation filter
    if (designation) {
      filter.designation = { $regex: designation, $options: 'i' };
    }
    
    // Search across multiple fields
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    // Validate and build sort object
    const allowedSortFields = ['name', 'joiningDate', 'salary', 'createdAt', 'department', 'designation', 'email', 'address'];
    const allowedSortOrders = ['asc', 'desc'];
    
    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: `Invalid sort field. Allowed fields: ${allowedSortFields.join(', ')}`
      });
    }
    
    if (!allowedSortOrders.includes(sortOrder)) {
      return res.status(400).json({
        success: false,
        message: 'Sort order must be either "asc" or "desc"'
      });
    }
    
    const sortObject = {};
    sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Validate pagination parameters
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    if (pageNum < 1 || limitNum < 1 || limitNum > 3000) {
      return res.status(400).json({
        success: false,
        message: 'Page must be >= 1, limit must be between 1 and 3000'
      });
    }

    // Calculate pagination
    const skip = (pageNum - 1) * limitNum;
    
    // Get employees with pagination, filtering, and sorting
    const employees = await Employee.find(filter)
      .select('-__v')
      .sort(sortObject)
      .skip(skip)
      .limit(limitNum);
    
    // Get total count for pagination
    const total = await Employee.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      message: 'Employees retrieved successfully',
      employees,
      totalPages: Math.ceil(total / limitNum),
      data: employees,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalEmployees: total,
        hasNextPage: skip + employees.length < total,
        hasPrevPage: pageNum > 1,
        limit: limitNum
      },
      filters: {
        search: search || null,
        department: department || null,
        status: status || null,
        designation: designation || null
      },
      sorting: {
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error('Error getting employees:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get single employee (both roles)
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const employee = await Employee.findById(id).select('-__v');
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Employee retrieved successfully',
      data: employee
    });
  } catch (error) {
    console.error('Error getting employee:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update employee (admin only)
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate input data
    const validationErrors = validateEmployeeData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Check if employee exists
    const existingEmployee = await Employee.findById(id);
    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Check if employeeId is being changed and if it conflicts
    if (req.body.employeeId && req.body.employeeId !== existingEmployee.employeeId) {
      const duplicateEmployeeId = await Employee.findOne({ 
        employeeId: req.body.employeeId,
        _id: { $ne: id }
      });
      if (duplicateEmployeeId) {
        return res.status(409).json({
          success: false,
          message: 'Employee with this Employee ID already exists'
        });
      }
    }

    // Check if email is being changed and if it conflicts
    if (req.body.email && req.body.email !== existingEmployee.email) {
      const duplicateEmail = await Employee.findOne({ 
        email: req.body.email,
        _id: { $ne: id }
      });
      if (duplicateEmail) {
        return res.status(409).json({
          success: false,
          message: 'Employee with this email already exists'
        });
      }
    }

    // Update employee
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete employee (admin only)
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if employee exists
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Delete employee
    await Employee.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      data: {
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email
      }
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}; 

// Get employee statistics (total and active counts)
export const getEmployeeStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: 'active' });
    res.status(200).json({
      success: true,
      totalEmployees,
      activeEmployees
    });
  } catch (error) {
    console.error('Error getting employee stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}; 

// Get employee statistics and analytics (both roles)
export const getEmployeeAnalytics = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    // Get current date and calculate period start
    const now = new Date();
    let periodStart;
    
    switch (period) {
      case 'week':
        periodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        periodStart = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case 'year':
        periodStart = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Aggregate analytics data
    const analytics = await Employee.aggregate([
      {
        $facet: {
          // Department distribution
          departmentStats: [
            { $group: { _id: '$department', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          
          // Salary statistics
          salaryStats: [
            {
              $group: {
                _id: null,
                avgSalary: { $avg: '$salary' },
                minSalary: { $min: '$salary' },
                maxSalary: { $max: '$salary' },
                totalSalary: { $sum: '$salary' }
              }
            }
          ],
          
          // Status distribution
          statusStats: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          
          // Recent hires (last 30 days)
          recentHires: [
            { $match: { joiningDate: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } } },
            { $count: 'count' }
          ],
          
          // Top departments by salary
          topDepartments: [
            {
              $group: {
                _id: '$department',
                avgSalary: { $avg: '$salary' },
                count: { $sum: 1 }
              }
            },
            { $sort: { avgSalary: -1 } },
            { $limit: 5 }
          ],
          
          // Employee growth over time
          growthData: [
            {
              $group: {
                _id: {
                  year: { $year: '$joiningDate' },
                  month: { $month: '$joiningDate' }
                },
                count: { $sum: 1 }
              }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 12 }
          ]
        }
      }
    ]);

    const result = analytics[0];
    
    // Calculate additional metrics
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: 'active' });
    
    // Calculate employee retention rate (employees hired more than 1 year ago)
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const longTermEmployees = await Employee.countDocuments({
      joiningDate: { $lte: oneYearAgo },
      status: 'active'
    });
    const retentionRate = totalEmployees > 0 ? (longTermEmployees / totalEmployees * 100).toFixed(1) : 0;

    res.json({
      success: true,
      message: 'Analytics retrieved successfully',
      data: {
        overview: {
          totalEmployees,
          activeEmployees,
          inactiveEmployees: totalEmployees - activeEmployees,
          retentionRate: `${retentionRate}%`
        },
        departmentStats: result.departmentStats,
        salaryStats: result.salaryStats[0] || {},
        statusStats: result.statusStats,
        recentHires: result.recentHires[0]?.count || 0,
        topDepartments: result.topDepartments,
        growthData: result.growthData,
        period: {
          type: period,
          start: periodStart,
          end: now
        }
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}; 
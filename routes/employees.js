import express from 'express';
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
  getEmployeeAnalytics
} from '../controllers/employeeController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin, requireHR } from '../middleware/roleCheck.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// POST /api/employees - Create employee (admin only)
router.post('/', requireAdmin, createEmployee);

// GET /api/employees - Get all employees (both roles)
router.get('/', getAllEmployees);

// GET /api/employees/stats - Get employee statistics (both roles)
router.get('/stats', getEmployeeStats);

// GET /api/employees/analytics - Get advanced analytics (both roles)
router.get('/analytics', getEmployeeAnalytics);

// GET /api/employees/:id - Get single employee (both roles)
router.get('/:id', getEmployeeById);

// PUT /api/employees/:id - Update employee (admin only)
router.put('/:id', requireAdmin, updateEmployee);

// DELETE /api/employees/:id - Delete employee (admin only)
router.delete('/:id', requireAdmin, deleteEmployee);

export default router; 
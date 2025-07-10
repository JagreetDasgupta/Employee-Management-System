// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://employee-management-system-c5qp.onrender.com';

export const API_ENDPOINTS = {
  // Authentication
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  PROFILE: `${API_BASE_URL}/api/auth/profile`,
  
  // Employees
  EMPLOYEES: `${API_BASE_URL}/api/employees`,
  EMPLOYEE_BY_ID: (id) => `${API_BASE_URL}/api/employees/${id}`,
  
  // Analytics
  ANALYTICS: `${API_BASE_URL}/api/employees/analytics`,
  DEPARTMENT_ANALYTICS: `${API_BASE_URL}/api/employees/analytics/departments`,
  SALARY_ANALYTICS: `${API_BASE_URL}/api/employees/analytics/salary`,
  
  // Health Check
  HEALTH: `${API_BASE_URL}/health`
};

export default API_BASE_URL; 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, 
  UserPlus, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Building,
  Plus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { API_ENDPOINTS } from '../config/api.js';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    totalSalary: 0,
    departments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get employee stats (total + active) first
      const statsRes = await axios.get(`${API_ENDPOINTS.EMPLOYEES}/stats`);
      const { totalEmployees, activeEmployees } = statsRes.data;

      // Get a sample of employees (up to 3000) for department breakdown
      const response = await axios.get(`${API_ENDPOINTS.EMPLOYEES}?limit=3000`);
      const employees = response.data.employees;

      // Calculate total salary from the sampled employees (approximate)
      const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);

      // Robust department statistics using sampled employees
      const ALL_DEPARTMENTS = [
        "Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "Design", "Product"
      ];
      // Build a lookup for normalization
      const deptLookup = {};
      ALL_DEPARTMENTS.forEach(d => deptLookup[d.toLowerCase()] = d);
      // Initialize counts
      const deptCounts = {};
      ALL_DEPARTMENTS.forEach(dept => { deptCounts[dept] = 0; });
      let unknownCount = 0;
      employees.forEach(emp => {
        const raw = (emp.department || '').trim().toLowerCase();
        if (deptLookup[raw]) {
          deptCounts[deptLookup[raw]]++;
        } else {
          unknownCount++;
        }
      });
      let departments = ALL_DEPARTMENTS
        .map(dept => ({
          name: dept,
          count: deptCounts[dept],
          percentage: employees.length ? Math.round((deptCounts[dept] / employees.length) * 100) : 0
        }))
        .filter(d => d.count > 0); // Only show departments with employees
      if (unknownCount > 0) {
        departments.push({
          name: "Unknown",
          count: unknownCount,
          percentage: employees.length ? Math.round((unknownCount / employees.length) * 100) : 0
        });
      }
      setStats({
        totalEmployees,
        activeEmployees,
        totalSalary,
        departments
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your employee management system</p>
        </div>
        <Link
          to="/employees/new"
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Employees</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeEmployees}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Salary</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.totalSalary.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Building className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Departments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.departments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Department Distribution */}
        <div className="card w-full overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.departments}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.departments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Bar Chart */}
        <div className="card w-full overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Employees by Department</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.departments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card w-full mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/employees"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="h-6 w-6 text-primary-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">View All Employees</p>
              <p className="text-sm text-gray-500">Browse and manage employees</p>
            </div>
          </Link>

          <Link
            to="/employees/new"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <UserPlus className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Add New Employee</p>
              <p className="text-sm text-gray-500">Create employee record</p>
            </div>
          </Link>

          <Link
            to="/profile"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Calendar className="h-6 w-6 text-purple-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">My Profile</p>
              <p className="text-sm text-gray-500">Manage your account</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
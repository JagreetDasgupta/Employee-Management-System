import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaArrowLeft, FaEnvelope, FaPhone, FaBuilding, FaBriefcase, FaDollarSign, FaCalendar, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isAdmin } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/employees/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEmployee(data.data);
      } else {
        setError('Failed to fetch employee details');
      }
    } catch (error) {
      setError('Error fetching employee details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/employees/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          navigate('/employees');
        } else {
          setError('Failed to delete employee');
        }
      } catch (error) {
        setError('Error deleting employee');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Employee not found</h2>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(salary);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/employees')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaArrowLeft /> Back to Employees
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Employee Details</h1>
          </div>
          <div className="flex space-x-2">
            {isAdmin && (
              <Link
                to={`/employees/${id}/edit`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaEdit /> Edit
              </Link>
            )}
            {isAdmin && (
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaTrash /> Delete
              </button>
            )}
          </div>
        </div>

        {/* Employee Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
            <div className="flex items-center space-x-6">
              <div className="h-20 w-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {(employee.name || '').split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h2 className="text-3xl font-bold">{employee.name}</h2>
                <p className="text-blue-100 text-lg">{employee.designation}</p>
                <p className="text-blue-200">Employee ID: {employee.employeeId}</p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-gray-400 w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">{employee.email}</p>
                    </div>
                  </div>
                  
                  {employee.phone && (
                    <div className="flex items-center space-x-3">
                      <FaPhone className="text-gray-400 w-5 h-5" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-900">{employee.phone}</p>
                      </div>
                    </div>
                  )}

                  {employee.address && (
                    <div className="flex items-start space-x-3">
                      <FaMapMarkerAlt className="text-gray-400 w-5 h-5 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="text-gray-900">{employee.address}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <FaCalendar className="text-gray-400 w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Hire Date</p>
                      <p className="text-gray-900">{formatDate(employee.joiningDate)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Work Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaBuilding className="text-gray-400 w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="text-gray-900">{employee.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaBriefcase className="text-gray-400 w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Position</p>
                      <p className="text-gray-900">{employee.designation}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaDollarSign className="text-gray-400 w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Salary</p>
                      <p className="text-gray-900">{formatSalary(employee.salary)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaUser className="text-gray-400 w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            {employee.emergencyContact && (employee.emergencyContact.name || employee.emergencyContact.phone) && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {employee.emergencyContact.name && (
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-gray-900 font-medium">{employee.emergencyContact.name}</p>
                    </div>
                  )}
                  {employee.emergencyContact.phone && (
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-900 font-medium">{employee.emergencyContact.phone}</p>
                    </div>
                  )}
                  {employee.emergencyContact.relationship && (
                    <div>
                      <p className="text-sm text-gray-500">Relationship</p>
                      <p className="text-gray-900 font-medium">{employee.emergencyContact.relationship}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="text-gray-900">{formatDate(employee.createdAt)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="text-gray-900">{formatDate(employee.updatedAt)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Employee ID</p>
                  <p className="text-gray-900 font-mono">{employee.employeeId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail; 
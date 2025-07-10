# Employee Management API - Project Structure

## 📁 Directory Structure

```
employee-management-api/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   ├── authController.js    # Authentication logic (register, login, profile)
│   └── employeeController.js # Employee CRUD operations
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── roleCheck.js         # Role-based access control middleware
├── models/
│   ├── Employee.js          # Employee MongoDB schema
│   └── User.js              # User MongoDB schema
├── routes/
│   ├── auth.js              # Authentication routes
│   └── employees.js         # Employee routes
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies and scripts
└── server.js               # Main application entry point
```

## 🏗️ Architecture Overview

### **Separation of Concerns**
- **Controllers**: Business logic and request handling
- **Routes**: URL routing and middleware composition
- **Middleware**: Authentication and authorization
- **Models**: Database schemas and data validation
- **Config**: Application configuration

### **Security Layers**
1. **Authentication** (`auth.js`): JWT token verification
2. **Authorization** (`roleCheck.js`): Role-based access control
3. **Input Validation**: Schema-level and controller-level validation

## 📋 File Descriptions

### **Configuration**
- **`config/database.js`**: MongoDB Atlas connection setup with error handling

### **Controllers**
- **`controllers/authController.js`**: 
  - `register()` - User registration with password hashing
  - `login()` - User authentication with JWT generation
  - `getProfile()` - Get current user profile
  - `changePassword()` - Password change functionality

- **`controllers/employeeController.js`**:
  - `createEmployee()` - Create new employee (admin only)
  - `getAllEmployees()` - Get employees with search, filter, pagination, sorting
  - `getEmployeeById()` - Get single employee by ID
  - `updateEmployee()` - Update employee (admin only)
  - `deleteEmployee()` - Delete employee (admin only)

### **Middleware**
- **`middleware/auth.js`**:
  - `authenticateToken()` - JWT token verification
  - `optionalAuth()` - Optional authentication for public routes

- **`middleware/roleCheck.js`**:
  - `requireAdmin()` - Admin-only access control
  - `requireHR()` - HR or Admin access control
  - `requireValidRole()` - General role validation

### **Models**
- **`models/User.js`**: User schema with password hashing and validation
- **`models/Employee.js`**: Employee schema with comprehensive validation

### **Routes**
- **`routes/auth.js`**: Authentication endpoints
- **`routes/employees.js`**: Employee management endpoints

## 🔐 Security Features

### **Authentication**
- JWT-based authentication
- Password hashing with bcryptjs
- Token expiration (24 hours)
- Secure token verification

### **Authorization**
- Role-based access control (admin, hr)
- Middleware-based route protection
- Granular permissions per endpoint

### **Data Validation**
- Schema-level validation (MongoDB/Mongoose)
- Controller-level input validation
- Error handling and sanitization

## 🚀 API Endpoints

### **Authentication Routes**
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - User login
GET    /api/auth/profile      - Get user profile (protected)
PUT    /api/auth/change-password - Change password (protected)
```

### **Employee Routes**
```
POST   /api/employees         - Create employee (admin only)
GET    /api/employees         - Get all employees (with search/filter/pagination)
GET    /api/employees/:id     - Get single employee
PUT    /api/employees/:id     - Update employee (admin only)
DELETE /api/employees/:id     - Delete employee (admin only)
```

## 🛠️ Development Features

### **Enhanced Employee API**
- **Search**: Across name, email, employeeId, department, designation
- **Filtering**: By department, status, designation
- **Pagination**: Page and limit parameters
- **Sorting**: By name, joiningDate, salary, createdAt, department, designation

### **Error Handling**
- Comprehensive error responses
- Validation error messages
- Database error handling
- Authentication error handling

### **Response Format**
```json
{
  "success": true/false,
  "message": "Human readable message",
  "data": {...},
  "pagination": {...}, // For list endpoints
  "filters": {...},    // For filtered results
  "sorting": {...}     // For sorted results
}
```

## 📦 Dependencies

### **Core Dependencies**
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `dotenv` - Environment variables

### **Development Dependencies**
- `nodemon` - Development server with auto-restart

## 🔧 Environment Variables

```env
PORT=3000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

## 🚀 Getting Started

1. **Install dependencies**: `npm install`
2. **Set up environment**: Copy `.env.example` to `.env` and configure
3. **Start development server**: `npm run dev`
4. **Test API**: Use the provided test scripts or API documentation

## 📚 Documentation Files

- **`API_DOCUMENTATION.md`** - Complete API reference
- **`QUERY_PARAMETERS_GUIDE.md`** - Employee API query parameters
- **`PROJECT_STRUCTURE.md`** - This file

## ✅ Best Practices Implemented

- **MVC Architecture**: Clear separation of concerns
- **Security First**: Authentication and authorization at every level
- **Input Validation**: Multiple layers of validation
- **Error Handling**: Comprehensive error responses
- **Code Organization**: Modular and maintainable structure
- **Documentation**: Complete API and project documentation 
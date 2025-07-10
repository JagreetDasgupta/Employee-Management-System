# Employee Management System API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
All employee endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication Endpoints

#### 1. Register User
- **POST** `/api/auth/register`
- **Access**: Public
- **Body**:
```json
{
  "username": "admin_user",
  "password": "password123",
  "role": "admin"
}
```
- **Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "username": "admin_user",
    "role": "admin",
    "id": "..."
  }
}
```

#### 2. Login User
- **POST** `/api/auth/login`
- **Access**: Public
- **Body**:
```json
{
  "username": "admin_user",
  "password": "password123"
}
```
- **Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "username": "admin_user",
      "role": "admin"
    }
  }
}
```

### Employee Endpoints

#### 1. Create Employee
- **POST** `/api/employees`
- **Access**: Admin only
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "employeeId": "EMP001",
  "name": "John Doe",
  "email": "john.doe@company.com",
  "phone": "+1234567890",
  "department": "IT",
  "designation": "Software Developer",
  "joiningDate": "2023-01-15",
  "salary": 75000,
  "status": "active"
}
```
- **Response** (201):
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "_id": "...",
    "employeeId": "EMP001",
    "name": "John Doe",
    "email": "john.doe@company.com",
    "phone": "+1234567890",
    "department": "IT",
    "designation": "Software Developer",
    "joiningDate": "2023-01-15T00:00:00.000Z",
    "salary": 75000,
    "status": "active",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

#### 2. Get All Employees
- **GET** `/api/employees`
- **Access**: Admin & HR
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page` (optional): Page number (default: 1, min: 1)
  - `limit` (optional): Items per page (default: 10, min: 1, max: 100)
  - `department` (optional): Filter by department (case-insensitive)
  - `status` (optional): Filter by status (active/inactive)
  - `designation` (optional): Filter by designation (case-insensitive)
  - `search` (optional): Search across name, email, employeeId, department, designation (case-insensitive)
  - `sortBy` (optional): Sort field (name, joiningDate, salary, createdAt, department, designation) (default: createdAt)
  - `sortOrder` (optional): Sort order (asc/desc) (default: desc)

**Example Query URLs:**
- `GET /api/employees?page=1&limit=5` - Basic pagination
- `GET /api/employees?department=IT&status=active` - Filter by department and status
- `GET /api/employees?search=john&sortBy=name&sortOrder=asc` - Search and sort by name
- `GET /api/employees?designation=developer&sortBy=salary&sortOrder=desc` - Filter by designation and sort by salary
- `GET /api/employees?page=2&limit=20&department=HR&status=active&sortBy=joiningDate&sortOrder=desc` - Complex query

- **Response** (200):
```json
{
  "success": true,
  "message": "Employees retrieved successfully",
  "data": [
    {
      "_id": "...",
      "employeeId": "EMP001",
      "name": "John Doe",
      "email": "john.doe@company.com",
      "phone": "+1234567890",
      "department": "IT",
      "designation": "Software Developer",
      "joiningDate": "2023-01-15T00:00:00.000Z",
      "salary": 75000,
      "status": "active",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalEmployees": 50,
    "hasNextPage": true,
    "hasPrevPage": false,
    "limit": 10
  },
  "filters": {
    "search": "john",
    "department": null,
    "status": null,
    "designation": null
  },
  "sorting": {
    "sortBy": "name",
    "sortOrder": "asc"
  }
}
```

#### 3. Get Single Employee
- **GET** `/api/employees/:id`
- **Access**: Admin & HR
- **Headers**: `Authorization: Bearer <token>`
- **Response** (200):
```json
{
  "success": true,
  "message": "Employee retrieved successfully",
  "data": {
    "_id": "...",
    "employeeId": "EMP001",
    "name": "John Doe",
    "email": "john.doe@company.com",
    "phone": "+1234567890",
    "department": "IT",
    "designation": "Software Developer",
    "joiningDate": "2023-01-15T00:00:00.000Z",
    "salary": 75000,
    "status": "active",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

#### 4. Update Employee
- **PUT** `/api/employees/:id`
- **Access**: Admin only
- **Headers**: `Authorization: Bearer <token>`
- **Body** (all fields optional):
```json
{
  "name": "John Smith",
  "salary": 80000,
  "status": "active"
}
```
- **Response** (200):
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": {
    "_id": "...",
    "employeeId": "EMP001",
    "name": "John Smith",
    "email": "john.doe@company.com",
    "phone": "+1234567890",
    "department": "IT",
    "designation": "Software Developer",
    "joiningDate": "2023-01-15T00:00:00.000Z",
    "salary": 80000,
    "status": "active",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T11:00:00.000Z"
  }
}
```

#### 5. Delete Employee
- **DELETE** `/api/employees/:id`
- **Access**: Admin only
- **Headers**: `Authorization: Bearer <token>`
- **Response** (200):
```json
{
  "success": true,
  "message": "Employee deleted successfully",
  "data": {
    "employeeId": "EMP001",
    "name": "John Doe",
    "email": "john.doe@company.com"
  }
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Employee ID is required",
    "Invalid email format"
  ]
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Employee not found"
}
```

### Conflict (409)
```json
{
  "success": false,
  "message": "Employee with this Employee ID already exists"
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Access denied. Admin role required."
}
```

### Internal Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

## Testing with cURL

### 1. Register a user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin_user",
    "password": "password123",
    "role": "admin"
  }'
```

### 2. Login to get token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin_user",
    "password": "password123"
  }'
```

### 3. Create an employee (use token from login)
```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "employeeId": "EMP001",
    "name": "John Doe",
    "email": "john.doe@company.com",
    "phone": "+1234567890",
    "department": "IT",
    "designation": "Software Developer",
    "joiningDate": "2023-01-15",
    "salary": 75000,
    "status": "active"
  }'
```

### 4. Get all employees
```bash
curl -X GET http://localhost:3000/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Get single employee
```bash
curl -X GET http://localhost:3000/api/employees/EMPLOYEE_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Update employee
```bash
curl -X PUT http://localhost:3000/api/employees/EMPLOYEE_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "salary": 80000,
    "status": "active"
  }'
```

### 7. Delete employee
```bash
curl -X DELETE http://localhost:3000/api/employees/EMPLOYEE_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Field Validation Rules

### Employee Fields:
- **employeeId**: Required, unique
- **name**: Required, non-empty string
- **email**: Required, valid email format, unique
- **phone**: Required, non-empty string
- **department**: Required, non-empty string
- **designation**: Required, non-empty string
- **joiningDate**: Required, valid date format
- **salary**: Required, positive number
- **status**: Required, must be one of: "active", "inactive"

### User Fields:
- **username**: Required, unique, 3-30 characters
- **password**: Required, minimum 6 characters
- **role**: Required, must be one of: "admin", "hr", "employee" 
# Employee Management System

A comprehensive Employee Management System built with Node.js, Express, MongoDB, and React. Features include user authentication, role-based access control, CRUD operations, advanced filtering, pagination, sorting, and analytics.

## 🚀 Features

### Core Features
- ✅ **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin & HR)
  - Secure password hashing with bcrypt

- ✅ **Employee Management**
  - Complete CRUD operations
  - Comprehensive employee profiles
  - Address and emergency contact management
  - Skills, education, and work experience tracking

- ✅ **Advanced Search & Filtering**
  - Multi-field search functionality
  - Department, status, and designation filters
  - Salary range filtering
  - Date-based filtering

- ✅ **Pagination & Sorting**
  - Configurable pagination
  - Multi-field sorting (name, salary, date, etc.)
  - Sort order control (ascending/descending)

- ✅ **Analytics & Reporting**
  - Department-wise employee statistics
  - Salary analytics and distributions
  - Employee count by various criteria
  - Performance metrics

### Security Features
- ✅ **Input Validation & Sanitization**
- ✅ **SQL Injection Prevention**
- ✅ **XSS Protection**
- ✅ **Rate Limiting**
- ✅ **Audit Trail Logging**

### Technical Features
- ✅ **RESTful API Design**
- ✅ **MongoDB Atlas Integration**
- ✅ **Comprehensive Error Handling**
- ✅ **API Documentation**
- ✅ **Testing Suite**

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (hosted on MongoDB Atlas)
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables

### Frontend (React)
- **React** - UI library
- **React Router** - Navigation
- **Context API** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

## 📁 Project Structure

```
Employee Management System/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── employeeController.js # Employee CRUD logic
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── roleCheck.js         # Role-based access control
├── models/
│   ├── Employee.js          # Employee schema
│   └── User.js              # User schema
├── routes/
│   ├── auth.js              # Authentication routes
│   └── employees.js         # Employee routes
├── frontend/                # React frontend
├── scripts/                 # Utility scripts
├── server.js                # Main server file
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/employee-management-system.git
   cd employee-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

4. **Generate Sample Data**
   ```bash
   node scripts/generateSampleData.js
   ```

5. **Start the server**
   ```bash
   npm start
   ```

6. **Start the frontend** (in a new terminal)
   ```bash
   cd frontend
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

### Employee Endpoints
- `GET /employees` - Get all employees (with filtering/pagination)
- `POST /employees` - Create new employee (Admin only)
- `GET /employees/:id` - Get employee by ID
- `PUT /employees/:id` - Update employee (Admin only)
- `DELETE /employees/:id` - Delete employee (Admin only)

### Analytics Endpoints
- `GET /employees/analytics` - General analytics
- `GET /employees/analytics/departments` - Department analytics
- `GET /employees/analytics/salary` - Salary analytics

## 🧪 Testing

### API Testing with Postman
1. Import the provided Postman collection
2. Set up environment variables
3. Follow the testing guide in `POSTMAN_SETUP_GUIDE.md`

### Automated Testing
```bash
# Run comprehensive API tests
node test_enhanced_api.js

# Run analytics tests
node test_analytics.js

# Run simple tests
node test_api.js
```

## 🔐 Security

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Admin and HR role permissions
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Cross-origin resource sharing security

## 📊 Features in Detail

### Advanced Filtering
- Search across multiple fields
- Filter by department, status, designation
- Salary range filtering
- Date-based filtering

### Pagination
- Configurable page size
- Page navigation
- Total count information

### Analytics
- Employee count by department
- Salary distribution analysis
- Hiring trends
- Performance metrics

## 🚀 Deployment

### Deploy to Render (Recommended)
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables
4. Deploy automatically

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## 📝 API Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@company.com",
    "password": "admin123",
    "role": "admin"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "admin123"
  }'
```

### Get Employees with Filtering
```bash
curl -X GET "http://localhost:3000/api/employees?department=Engineering&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Express.js community
- React.js community
- All contributors and testers

---

**⭐ Star this repository if you find it helpful!** 
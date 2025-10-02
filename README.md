# Employee Management System

Modern full-stack Employee Management System with secure authentication, role-based access control, rich employee CRUD, advanced filtering/sorting/pagination, analytics, and auditing. Backend is Node.js/Express/MongoDB; frontend is React (Context API, React Router, Tailwind UI).

## Live Demo

- App: [employee-management-system-frontend-4ix6.onrender.com](https://employee-management-system-frontend-4ix6.onrender.com)

## Key Features

- Authentication and authorization
  - JWT auth, persistent sessions on frontend
  - Roles: `admin`, `hr`
  - Protected routes and fine-grained access (admin can create/update/delete employees)
- Employee management
  - Create, read, update, delete employees
  - Strong validation for email, phone, salary, joining date, and required fields
  - Server-side pagination, sorting, and multi-field search
- Analytics and stats
  - Overview metrics (totals, active count, retention proxy, department distribution, salary stats, growth data)
- Audit logging (admin can query and export audit logs)
- Health/diagnostics endpoints and robust error handling

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JSON Web Tokens, bcryptjs, dotenv
- Frontend: React 18, React Router 6, Context API, Fetch/Axios, Tailwind CSS, Recharts

## Architecture & Project Structure

```text
Employee Management System/
├── server.js                     # Express app bootstrap and route wiring
├── config/
│   └── database.js              # MongoDB connection via MONGODB_URI
├── controllers/
│   ├── authController.js        # register, login, profile, change password, update profile
│   └── employeeController.js    # employees CRUD, stats, analytics with validation
├── middleware/
│   ├── auth.js                  # JWT verification, optional auth
│   ├── roleCheck.js             # requireAdmin, requireHR, requireValidRole
│   └── audit.js                 # audit log schema, middleware, export
├── models/
│   ├── Employee.js              # Employee schema with validation and virtuals
│   └── User.js                  # User schema with pre-save hashing and helpers
├── routes/
│   ├── auth.js                  # /api/auth/*
│   ├── employees.js             # /api/employees/* (protected)
│   └── audit.js                 # /api/audit/* (admin-only)
├── frontend/                    # React app
└── scripts/                     # Data generation and utilities
```

## Environment Variables

Backend `.env` (root):

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

Frontend `.env` (inside `frontend/`):

```env
REACT_APP_API_URL=https://your-backend-host
```

If not set, frontend defaults to `https://employee-management-system-c5qp.onrender.com` per `frontend/src/config/api.js`.

## Local Development

1. Install dependencies

```bash
npm install
cd frontend && npm install
```

1. Configure environment files as above

1. Seed or generate data (optional)

Useful scripts in root and `scripts/`:

```bash
node generate_sample_data.js
node scripts/generateSampleData.js
node scripts/generateBulkEmployees.js
node scripts/addBulkEmployees.js
```

1. Run servers

```bash
# backend (root)
npm run dev     # with nodemon
# or
npm start       # plain node

# frontend (separate terminal)
cd frontend
npm start
```

The backend exposes a health check at `/health`. The API root `/` returns metadata including available route prefixes.

## Authentication and Roles

- Register and login under `/api/auth/*`. Roles are lowercase: `admin` or `hr`.
- The `Authorization: Bearer <token>` header is required for all `/api/employees/*` and `/api/audit/*` routes.
- Frontend protects admin-only pages (create/edit employee) using role checks.

Demo credentials (from UI):

```text
Admin: admin@admin.com / admin
HR:    hr@hr.com       / hr
```

## REST API

Base URL examples:

```text
http://localhost:3000
https://your-backend-host
```

### Health and root

- `GET /health` → `{ status: 'OK', uptime, environment }`
- `GET /` → API metadata and route map

### Auth routes (`/api/auth`)

- `POST /register` → body: `{ username, password, role }` where role ∈ {`admin`,`hr`}
- `POST /login` → body: `{ username, password }` returns `{ token, user }`
- `GET /profile` → returns current user (requires Bearer token)
- `PUT /change-password` → body: `{ currentPassword, newPassword }`
- `PUT /profile` → body: `{ name?, email?, currentPassword?, newPassword? }`

### Employee routes (`/api/employees`) [protected]

- `POST /` (admin) → create employee
- `GET /` → list employees with filtering, pagination, sorting
- `GET /stats` → total and active counts
- `GET /analytics` → aggregated analytics (department, salary stats, status distribution, growth, recent hires, overview)
- `GET /:id` → fetch single employee
- `PUT /:id` (admin) → update employee
- `DELETE /:id` (admin) → delete employee

Query params for `GET /api/employees`:

```bash
page=1            # >=1
limit=10          # 1..3000
search=term       # matches name,email,employeeId,department,designation,address
department=IT     # case-insensitive
designation=Mgr   # case-insensitive
status=active     # active|inactive
sortBy=name       # one of name,joiningDate,salary,createdAt,department,designation,email,address
sortOrder=asc     # asc|desc
```

### Audit routes (`/api/audit`) [admin-only]

- `GET /logs` → paginated audit logs with filters: `action, resource, userId, startDate, endDate, success`
- `GET /export` → CSV export of filtered audit logs

## Data Models

### Employee

- Required: `employeeId` (unique, uppercase), `name`, `email` (unique), `department`, `designation`, `joiningDate`, `salary`
- Optional: `phone`, `address`
- Validations: email format, phone E.164-like, salary range [0..1,000,000], joiningDate ≤ today, department enum
- Virtuals: `yearsOfService`

### User

- Fields: `username` (email), `password` (hashed), `role` (`admin`|`hr`), `status`, `name`, `email`, `lastLogin`
- Pre-save hashing and `comparePassword` helper

## Frontend

- React app with protected routes and role gating
- API base configured via `REACT_APP_API_URL` in `frontend/src/config/api.js`
- Pages: Dashboard, Employees (list + filters + pagination), Employee Detail, Employee Form (admin), Profile, Login
- Visual components: Layout, LoadingSpinner, Toasts, Icons; charts via Recharts

## Postman and Docs

- Postman collection: `Employee_Management_API.postman_collection.json`
- Postman environment: `Employee_Management_Environment.postman_environment.json`
- Additional docs:
  - `API_DOCUMENTATION.md`
  - `PROJECT_STRUCTURE.md`
  - `POSTMAN_SETUP_GUIDE.md`
  - `FRONTEND_SETUP_GUIDE.md`
  - `FRONTEND_DEPLOYMENT_GUIDE.md`
  - `DEPLOYMENT_GUIDE.md`
  - `JWT_EXPLANATION.md`

## Security & Error Handling

- JWT validation on protected routes; clear messages for missing/invalid/expired tokens
- Input validation with detailed error responses
- Role checks for admin-only endpoints
- Central error handler responds with 500 and hides internals in production
- CORS headers enabled for API access

## Deployment

- Render configuration files present (`render.yaml` in root and frontend)
- Set environment variables on the platform; point frontend `REACT_APP_API_URL` to backend URL
- Use health check `/health` for monitoring

## Usage Examples

Register (admin user):

```bash
curl -X POST "$API/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@company.com","password":"StrongPass123","role":"admin"}'
```

Login and store token:

```bash
TOKEN=$(curl -s -X POST "$API/api/auth/login" -H "Content-Type: application/json" -d '{"username":"admin@company.com","password":"StrongPass123"}' | jq -r .data.token)
```

List employees (search + sort):

```bash
curl "$API/api/employees?search=eng&sortBy=name&sortOrder=asc&page=1&limit=10" -H "Authorization: Bearer $TOKEN"
```

## License

ISC

---

If this project helps you, please consider starring it and sharing feedback.
# Employee Management System

A full-stack employee management platform with authentication, role-based access, analytics, and audit logging.

---

## Features
- User authentication (JWT)
- Role-based access (Admin, HR)
- Employee CRUD
- Analytics dashboard
- Audit logging
- Bulk data generation
- Responsive React frontend

---

## Demo Credentials
- **Admin:** admin@admin.com / admin
- **HR:** hr@hr.com / hr

---

## Documentation
- [API Documentation](./API_DOCUMENTATION.md)
- [Data Models](./DATA_MODELS.md)
- [Demo Walkthrough (Postman & Curl)](./DEMO_WALKTHROUGH.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Frontend Setup Guide](./FRONTEND_SETUP_GUIDE.md)

---

## Screenshots
Screenshots of the UI and API usage can be found in `frontend/public/screenshots/`.

**Recommended screenshots:**
- Login page
- Dashboard (with charts)
- Employee list
- Employee detail
- Profile page
- Postman or curl API requests

To add your own, save PNG/JPG files in `frontend/public/screenshots/` and reference them here:

```md
![Login](frontend/public/screenshots/login.png)
![Dashboard](frontend/public/screenshots/dashboard.png)
```

---

## Quickstart
1. Clone the repo
2. Install dependencies (`npm install` in root and `frontend/`)
3. Set up `.env` with your MongoDB URI and JWT secret
4. Run backend: `npm start`
5. Run frontend: `cd frontend && npm start`

---

## Project Structure
See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for details.

---

## License
MIT 
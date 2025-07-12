# Data Models

## Employee
- **employeeId**: String (unique, required)
- **name**: String (required)
- **email**: String (unique, required)
- **phone**: String (optional)
- **address**: String (optional)
- **department**: String (required, enum: Engineering, HR, Finance, Marketing, Sales, Operations, Design)
- **designation**: String (required)
- **joiningDate**: Date (required)
- **salary**: Number (required)
- **status**: String (active/inactive, default: active)
- **Timestamps**: createdAt, updatedAt

## User
- **username**: String (unique, required)
- **password**: String (hashed, required)
- **role**: String (admin, hr, etc.)
- **name**: String (optional)
- **email**: String (optional)
- **lastLogin**: Date (optional)
- **Timestamps**: createdAt, updatedAt

See `/models/Employee.js` and `/models/User.js` for full schema details. 
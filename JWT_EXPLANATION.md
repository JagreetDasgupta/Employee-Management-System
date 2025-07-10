# JWT Authentication System Explanation

## What is JWT?

JWT (JSON Web Token) is a compact, URL-safe means of representing claims to be transferred between two parties. In our authentication system, JWT is used to securely transmit user information between the client and server.

## How JWT Works in Our System

### 1. **Token Structure**
A JWT consists of three parts separated by dots (`.`):
```
header.payload.signature
```

**Example:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWE5YjQ5YjQ5YjQ5YjQ5IiwiaWF0IjoxNzA1NzQ5NjAwLCJleHAiOjE3MDU4MzYwMDB9.signature
```

### 2. **Token Generation (Login/Register)**
```javascript
const generateToken = (userId) => {
  return jwt.sign(
    { userId },                    // Payload (user data)
    process.env.JWT_SECRET,        // Secret key
    { expiresIn: '24h' }          // Expiration time
  );
};
```

### 3. **Token Verification (Middleware)**
```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// Returns: { userId: "user_id", iat: timestamp, exp: timestamp }
```

## Authentication Flow

### **Registration Flow:**
1. User submits registration data
2. Server validates input
3. Password is hashed with bcrypt
4. User is saved to database
5. JWT token is generated
6. Token is returned to client

### **Login Flow:**
1. User submits credentials
2. Server finds user by username
3. Password is verified with bcrypt
4. JWT token is generated
5. Token is returned to client

### **Protected Route Access:**
1. Client sends request with token in Authorization header
2. Server extracts token from header
3. JWT is verified using secret key
4. User is fetched from database
5. Request proceeds with user context

## Security Features

### **1. Password Hashing**
- Uses bcrypt with salt rounds of 12
- Passwords are never stored in plain text
- Automatic hashing on save/update

### **2. Token Security**
- Tokens expire after 24 hours
- Secret key is stored in environment variables
- Tokens are verified on every protected request

### **3. Role-Based Access Control**
- `requireAdmin`: Only admin users can access
- `requireHR`: HR or admin users can access
- `authenticateToken`: Any authenticated user can access

## API Endpoints

### **Authentication Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout (client-side)
- `POST /api/auth/refresh` - Refresh token

### **Protected Endpoints:**
- `GET /api/protected` - Any authenticated user
- `GET /api/admin-only` - Admin only
- `GET /api/hr-admin` - HR or Admin

## Usage Examples

### **Register a User:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin_user",
    "password": "password123",
    "role": "admin"
  }'
```

### **Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin_user",
    "password": "password123"
  }'
```

### **Access Protected Route:**
```bash
curl -X GET http://localhost:3000/api/protected \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Error Handling

### **Common JWT Errors:**
- `JsonWebTokenError`: Invalid token
- `TokenExpiredError`: Token has expired
- `UnauthorizedError`: No token provided

### **Response Format:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Best Practices

1. **Store tokens securely** on the client side
2. **Include tokens** in Authorization header: `Bearer <token>`
3. **Handle token expiration** gracefully
4. **Use HTTPS** in production
5. **Rotate JWT secrets** periodically
6. **Keep tokens short-lived** (24 hours in our case)

## Testing the System

1. **Register a user** using `/api/auth/register`
2. **Login** using `/api/auth/login`
3. **Copy the token** from the response
4. **Test protected routes** by including the token in the Authorization header
5. **Test role-based access** with different user roles 
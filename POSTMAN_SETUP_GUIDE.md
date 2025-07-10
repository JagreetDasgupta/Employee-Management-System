# Postman Setup Guide for Employee Management System

## Step 1: Import the Collection and Environment

1. **Open Postman**
2. **Import Collection**:
   - Click "Import" button
   - Select the file: `Employee_Management_API.postman_collection.json`
   - Click "Import"

3. **Import Environment**:
   - Click "Import" button again
   - Select the file: `Employee_Management_Environment.postman_environment.json`
   - Click "Import"

4. **Select Environment**:
   - In the top-right corner, select "Employee Management System" from the environment dropdown

## Step 2: Verify Your Server is Running

Make sure your Node.js server is running:
```bash
npm start
```

You should see: `Server running on port 3000`

## Step 3: Testing Sequence

### Phase 1: Authentication Testing

1. **Register a User (Optional)**:
   - Go to "Authentication" folder
   - Click "Register User (Optional)"
   - Click "Send"
   - Expected: 201 Created with user details
   - **Note**: Sample data is already loaded, so registration is optional

2. **Login Admin User**:
   - Click "Login Admin User"
   - Click "Send"
   - Expected: 200 OK with JWT token
   - **Important**: The token will be automatically saved to environment variables
   - **Credentials**: admin / admin123

3. **Get Profile**:
   - Click "Get Profile"
   - Click "Send"
   - Expected: 200 OK with user profile

### Phase 2: Employee CRUD Operations

1. **Create Employee**:
   - Go to "Employee CRUD Operations" folder
   - Click "Create Employee"
   - Click "Send"
   - Expected: 201 Created with employee details
   - **Copy the employee ID** from the response for later use

2. **Get All Employees**:
   - Click "Get All Employees"
   - Click "Send"
   - Expected: 200 OK with array of employees

3. **Get Employee by ID**:
   - Click "Get Employee by ID"
   - Replace `EMPLOYEE_ID_HERE` with the actual employee ID
   - Click "Send"
   - Expected: 200 OK with employee details

4. **Update Employee**:
   - Click "Update Employee"
   - Replace `EMPLOYEE_ID_HERE` with the actual employee ID
   - Click "Send"
   - Expected: 200 OK with updated employee

5. **Delete Employee**:
   - Click "Delete Employee"
   - Replace `EMPLOYEE_ID_HERE` with the actual employee ID
   - Click "Send"
   - Expected: 200 OK with deletion confirmation

### Phase 3: Advanced Features Testing

1. **Filter Employees**:
   - Go to "Advanced Features" folder
   - Click "Filter Employees"
   - Click "Send"
   - Expected: 200 OK with filtered results

2. **Pagination**:
   - Click "Pagination"
   - Click "Send"
   - Expected: 200 OK with paginated results

3. **Sort Employees**:
   - Click "Sort Employees"
   - Click "Send"
   - Expected: 200 OK with sorted results

4. **Search Employees**:
   - Click "Search Employees"
   - Click "Send"
   - Expected: 200 OK with search results

### Phase 4: Analytics Testing

1. **Get Analytics**:
   - Go to "Analytics & Reports" folder
   - Click "Get Analytics"
   - Click "Send"
   - Expected: 200 OK with analytics data

2. **Department Analytics**:
   - Click "Department Analytics"
   - Click "Send"
   - Expected: 200 OK with department statistics

3. **Salary Analytics**:
   - Click "Salary Analytics"
   - Click "Send"
   - Expected: 200 OK with salary statistics

### Phase 5: Role-Based Access Testing

1. **HR Login**:
   - Go to "Role-Based Access Testing" folder
   - Click "HR Login"
   - Click "Send"
   - Expected: 200 OK with HR token

2. **HR Create Employee (Should Fail)**:
   - Click "HR Create Employee (Should Fail)"
   - Click "Send"
   - Expected: 403 Forbidden (access denied)

3. **HR Get Employees (Should Work)**:
   - Click "HR Get Employees (Should Work)"
   - Click "Send"
   - Expected: 200 OK with employee list

## Step 4: Manual Testing Tips

### Testing Different Scenarios

1. **Invalid Credentials**:
   - Try logging in with wrong password
   - Expected: 401 Unauthorized

2. **Invalid Token**:
   - Remove or modify the Authorization header
   - Expected: 401 Unauthorized

3. **Missing Required Fields**:
   - Remove required fields from request body
   - Expected: 400 Bad Request with validation errors

4. **Invalid Employee ID**:
   - Use a non-existent employee ID
   - Expected: 404 Not Found

### Environment Variables

The collection automatically manages these variables:
- `token`: Current user's JWT token
- `admin_token`: Admin user's JWT token
- `hr_token`: HR user's JWT token
- `user_role`: Current user's role
- `base_url`: API base URL (http://localhost:3000)

### Response Validation

Check these in each response:
- **Status Code**: Should match expected HTTP status
- **Response Body**: Should contain expected data structure
- **Headers**: Should include proper content-type
- **Error Messages**: Should be descriptive for failed requests

## Step 5: Advanced Testing

### Bulk Operations
You can also test the bulk operations using the scripts in your project:
```bash
node scripts/addBulkEmployees.js
node test_enhanced_api.js
```

### Performance Testing
- Use Postman's "Runner" feature to test multiple requests
- Monitor response times
- Test with different data sizes

## Troubleshooting

### Common Issues

1. **Server Not Running**:
   - Error: "Could not get any response"
   - Solution: Start server with `npm start`

2. **CORS Issues**:
   - Error: CORS policy errors
   - Solution: Check server CORS configuration

3. **Database Connection**:
   - Error: Database connection failed
   - Solution: Check MongoDB connection string

4. **Token Expired**:
   - Error: 401 Unauthorized
   - Solution: Re-login to get fresh token

### Debug Tips

1. **Check Console Logs**: Monitor your server console for errors
2. **Use Postman Console**: View detailed request/response logs
3. **Test Individual Endpoints**: Start with simple GET requests
4. **Verify Environment**: Ensure correct environment is selected

## Success Criteria

Your API is working correctly if:
- ✅ All authentication endpoints return proper responses
- ✅ CRUD operations work for employees
- ✅ Advanced features (filtering, pagination, sorting) work
- ✅ Analytics endpoints return data
- ✅ Role-based access control works properly
- ✅ Error handling works for invalid requests

## Next Steps

After successful Postman testing:
1. Test the React frontend
2. Run the automated test scripts
3. Document any issues found
4. Prepare for demonstration

Happy Testing! 🚀 
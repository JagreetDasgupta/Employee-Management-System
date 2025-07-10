# Employee API Query Parameters Guide

## GET /api/employees

### Pagination Parameters
- **`page`** (optional): Page number
  - Default: `1`
  - Minimum: `1`
  - Example: `?page=2`

- **`limit`** (optional): Number of employees per page
  - Default: `10`
  - Minimum: `1`
  - Maximum: `100`
  - Example: `?limit=20`

### Filtering Parameters
- **`department`** (optional): Filter by department
  - Case-insensitive search
  - Example: `?department=IT`

- **`status`** (optional): Filter by employee status
  - Valid values: `active`, `inactive`
  - Example: `?status=active`

- **`designation`** (optional): Filter by job designation
  - Case-insensitive search
  - Example: `?designation=developer`

- **`search`** (optional): Search across multiple fields
  - Searches in: name, email, employeeId, department, designation
  - Case-insensitive search
  - Example: `?search=john`

### Sorting Parameters
- **`sortBy`** (optional): Field to sort by
  - Valid fields: `name`, `joiningDate`, `salary`, `createdAt`, `department`, `designation`
  - Default: `createdAt`
  - Example: `?sortBy=name`

- **`sortOrder`** (optional): Sort direction
  - Valid values: `asc`, `desc`
  - Default: `desc`
  - Example: `?sortOrder=asc`

## Example Query URLs

### Basic Examples
```
GET /api/employees
GET /api/employees?page=1&limit=10
GET /api/employees?search=john
GET /api/employees?department=IT
GET /api/employees?status=active
```

### Advanced Examples
```
GET /api/employees?page=2&limit=20&department=IT&status=active
GET /api/employees?search=developer&sortBy=salary&sortOrder=desc
GET /api/employees?designation=manager&sortBy=joiningDate&sortOrder=asc
GET /api/employees?department=HR&status=active&sortBy=name&sortOrder=asc&page=1&limit=5
```

### Complex Queries
```
GET /api/employees?search=john&department=IT&status=active&sortBy=salary&sortOrder=desc&page=1&limit=10
GET /api/employees?designation=developer&sortBy=joiningDate&sortOrder=desc&page=2&limit=15
```

## Response Structure

```json
{
  "success": true,
  "message": "Employees retrieved successfully",
  "data": [...],
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
    "department": "IT",
    "status": "active",
    "designation": null
  },
  "sorting": {
    "sortBy": "name",
    "sortOrder": "asc"
  }
}
```

## Error Handling

### Invalid Parameters
- **Invalid status**: Returns 400 with message "Status must be either 'active' or 'inactive'"
- **Invalid sortBy**: Returns 400 with message "Invalid sort field. Allowed fields: name, joiningDate, salary, createdAt, department, designation"
- **Invalid sortOrder**: Returns 400 with message "Sort order must be either 'asc' or 'desc'"
- **Invalid pagination**: Returns 400 with message "Page must be >= 1, limit must be between 1 and 100"

### Example Error Response
```json
{
  "success": false,
  "message": "Status must be either \"active\" or \"inactive\""
}
``` 
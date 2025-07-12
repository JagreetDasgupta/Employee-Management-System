# Demo Walkthrough: API Usage via Postman & Curl

## 1. Login (Admin)

**Curl:**
```bash
curl -X POST https://<your-api>/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username": "admin@admin.com", "password": "admin"}'
```

**Postman:**
- Method: POST
- URL: `/api/auth/login`
- Body (JSON):
  ```json
  {
    "username": "admin@admin.com",
    "password": "admin"
  }
  ```

---

## 2. Get All Employees

**Curl:**
```bash
curl -X GET https://<your-api>/api/employees \
  -H 'Authorization: Bearer <token>'
```

**Postman:**
- Method: GET
- URL: `/api/employees`
- Headers: `Authorization: Bearer <token>`

---

## 3. Add Employee (Admin Only)

**Curl:**
```bash
curl -X POST https://<your-api>/api/employees \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "employeeId": "EMP99999",
    "name": "John Doe",
    "email": "john.doe@company.com",
    "department": "Engineering",
    "designation": "Software Engineer",
    "joiningDate": "2023-01-01",
    "salary": 90000
  }'
```

**Postman:**
- Method: POST
- URL: `/api/employees`
- Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`
- Body: (see above)

---

## 4. Edit Employee (Admin Only)

**Curl:**
```bash
curl -X PUT https://<your-api>/api/employees/<employeeId> \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{ "name": "Jane Doe" }'
```

**Postman:**
- Method: PUT
- URL: `/api/employees/<employeeId>`
- Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`
- Body: `{ "name": "Jane Doe" }`

---

## 5. View Analytics

**Curl:**
```bash
curl -X GET https://<your-api>/api/analytics \
  -H 'Authorization: Bearer <token>'
```

**Postman:**
- Method: GET
- URL: `/api/analytics`
- Headers: `Authorization: Bearer <token>`

---

## 6. Logout

**Curl:**
```bash
# (Usually handled client-side by deleting the token)
```

---

> Replace `<your-api>` with your deployed API URL and `<token>` with the JWT from login.

---

## Screenshots
- Add screenshots of the UI and Postman requests here or in `frontend/public/screenshots/`. 
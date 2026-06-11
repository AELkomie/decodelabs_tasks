# Project 2 — Backend API Development
**DecodeLabs Full Stack Training | Batch 2026**

A RESTful Users API built with Node.js + Express. Covers GET/POST endpoints, input validation, proper HTTP status codes, and clean project structure.

---

## Setup & Run

```bash
npm install
node index.js
```

Server starts at: `http://localhost:3000`

---

## Project Structure

```
project2-api/
├── index.js                  # Entry point, server setup
├── routes/
│   └── users.js              # Route definitions
├── controllers/
│   └── userController.js     # Business logic
├── middleware/
│   └── validate.js           # Input validation (The Gatekeeper)
├── data/
│   └── users.js              # In-memory data store
└── README.md
```

---

## API Endpoints

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Check if server is running |

---

### Users

#### GET /api/users
Returns all users (passwords never exposed).

**Response 200:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    { "id": 1, "name": "Alice Johnson", "email": "alice@example.com", "role": "admin", "createdAt": "..." }
  ]
}
```

---

#### GET /api/users/:id
Returns a single user by ID.

**Response 200:**
```json
{ "success": true, "data": { "id": 1, "name": "Alice Johnson", ... } }
```

**Response 404:**
```json
{ "error": "User with id 99 not found" }
```

---

#### POST /api/users/register
Registers a new user.

**Request Body:**
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret123" }
```

**Response 201:**
```json
{ "success": true, "message": "User registered successfully", "data": { "id": 3, ... } }
```

**Response 400** (validation failed):
```json
{ "error": "Validation failed", "details": ["email format is invalid"] }
```

**Response 409** (email taken):
```json
{ "error": "Email is already registered" }
```

---

#### POST /api/users/login
Validates credentials.

**Request Body:**
```json
{ "email": "alice@example.com", "password": "hashed_password_123" }
```

**Response 200:**
```json
{ "success": true, "message": "Login successful", "data": { "id": 1, "name": "Alice Johnson", ... } }
```

**Response 401:**
```json
{ "error": "Invalid email or password" }
```

---

#### POST /api/users/:id/profile
Updates a user's name or email.

**Request Body:**
```json
{ "name": "Alice J. Updated" }
```

**Response 200:**
```json
{ "success": true, "message": "Profile updated successfully", "data": { ... } }
```

---

## HTTP Status Codes Used

| Code | Meaning | Used When |
|------|---------|-----------|
| 200 | OK | Successful GET or login |
| 201 | Created | New user registered |
| 400 | Bad Request | Validation failed |
| 401 | Unauthorized | Wrong credentials |
| 404 | Not Found | User ID doesn't exist |
| 409 | Conflict | Email already registered |
| 500 | Internal Error | Unexpected server crash |

---

## Key Concepts Demonstrated

- **RESTful naming** — resources are nouns (`/users`), not verbs (`/getUsers`)
- **Separation of concerns** — routes → controllers → data layer
- **The Gatekeeper Rule** — all input validated before touching data
- **Syntactic validation** — correct format? (email regex, min length)
- **Semantic validation** — valid logic? (duplicate email check)
- **Safe responses** — passwords are never returned in any response
- **Proper status codes** — the server communicates state clearly

---

## Test with curl

```bash
# Get all users
curl http://localhost:3000/api/users

# Register
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"secret123"}'

# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"hashed_password_123"}'

# Get user by ID
curl http://localhost:3000/api/users/1

# Update profile
curl -X POST http://localhost:3000/api/users/1/profile \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Updated"}'
```

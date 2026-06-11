# DecodeLabs — Project 4: Frontend & Backend Integration
**Stack:** Vanilla JS · HTML/CSS · Node.js · Express · PostgreSQL · Prisma · CORS

---

## What This Project Demonstrates
- **Full I-P-O loop**: Frontend sends fetch() → Backend routes → DB query → JSON response → DOM update
- **CORS** configured so the browser allows cross-origin requests
- **async/await** with try/catch for all network calls — no "frozen webpage"
- **HTTP status codes** checked via `response.ok` before processing data
- **JSON serialization** with `JSON.stringify()` on send, `response.json()` on receive
- **XSS protection** using `textContent` instead of `innerHTML` for user data
- **Loading / error / empty states** for graceful degradation

---

## Project Structure
```
project4/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        ← Interns table schema
│   │   └── seed.js              ← Sample data
│   ├── src/
│   │   ├── controllers/
│   │   │   └── internController.js  ← CRUD logic
│   │   ├── routes/
│   │   │   └── internRoutes.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   ├── prismaClient.js
│   │   └── index.js             ← Express app + CORS
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── index.html
    ├── styles.css
    └── app.js                   ← All fetch() calls, DOM manipulation
```

---

## Setup Instructions

### 1. PostgreSQL — create the database
```sql
CREATE DATABASE decodelabs_p4;
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env
# Edit .env: set DATABASE_URL with your postgres credentials

npm install
npx prisma migrate dev --name init   # creates the interns table
npm run db:seed                       # optional: adds sample data
npm run dev                           # starts on http://localhost:5000
```

### 3. Frontend setup
No build step needed — open `frontend/index.html` directly in your browser,
or serve it with:
```bash
npx serve frontend
# or:
python3 -m http.server 3000 --directory frontend
```

---

## API Reference

| Method | Endpoint              | Description                           |
|--------|-----------------------|---------------------------------------|
| GET    | /api/health           | Check DB connection status            |
| GET    | /api/interns          | Get all interns (supports ?search=)   |
| POST   | /api/interns          | Register a new intern                 |
| GET    | /api/interns/:id      | Get one intern by ID                  |
| PUT    | /api/interns/:id      | Update an intern                      |
| DELETE | /api/interns/:id      | Delete an intern                      |

### Request body (POST / PUT)
```json
{
  "name":   "Alice Johnson",
  "email":  "alice@example.com",
  "role":   "Frontend Dev",
  "skills": ["HTML", "CSS", "React"]
}
```

---

## Key Concepts from Slides Implemented

| Concept | Where |
|---------|-------|
| I-P-O Architecture | `app.js` → `index.js` → Prisma → JSON response → DOM |
| async / await | Every `fetch()` call in `app.js` |
| CORS | `cors()` middleware in `backend/src/index.js` |
| HTTP Status Codes | `if (!res.ok) throw new Error(...)` pattern throughout |
| JSON Serialization | `JSON.stringify()` on POST/PUT, `response.json()` on all responses |
| DOM Injection (safe) | `textContent` for user data, `innerHTML` only for trusted markup |
| try/catch + finally | All fetch calls wrapped, loading spinners hidden in finally |
| Graceful Degradation | Loading, error, and empty states shown to user |

# React Node PostgreSQL Auth Template

Reusable full-stack application template with authentication, role-based
access control, PostgreSQL migrations, validation, security middleware,
and automated tests.

## Tech stack

### Frontend

- React
- Vite
- React Router (`react-router`)
- Axios
- Vitest
- React Testing Library
- jsdom

### Backend

- Node.js
- Express
- PostgreSQL
- `pg`
- JWT (`jsonwebtoken`)
- HttpOnly cookies
- `bcryptjs`
- Zod
- Helmet
- `express-rate-limit`
- Vitest
- Supertest

## Features

- User registration
- Login and logout
- JWT authentication with HttpOnly cookies
- Current-user endpoint
- Protected React routes
- Role-based authorization
- `user`, `moderator`, and `admin` roles
- Admin user management
- User role changes
- User deletion
- PostgreSQL migrations
- Zod request validation
- Centralized Express error handling
- Login and registration rate limiting
- Security headers with Helmet
- Separate development and test databases
- Backend authentication tests
- Frontend authentication and routing tests

## Project structure

```text
react-node-postgres-auth-template/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ProtectedRoute.test.jsx
│   │   │   ├── RoleRoute.jsx
│   │   │   └── RoleRoute.test.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   ├── AuthProvider.jsx
│   │   │   └── useAuth.js
│   │   ├── pages/
│   │   │   ├── Admin.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Login.test.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── test/
│   │   │   └── setup.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiters.js
│   │   └── validate.js
│   ├── migrations/
│   ├── models/
│   │   ├── authModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── users.js
│   ├── scripts/
│   │   └── runMigrations.js
│   ├── tests/
│   │   ├── helpers/
│   │   │   └── database.js
│   │   ├── auth.test.js
│   │   └── setup.js
│   ├── utils/
│   │   └── token.js
│   ├── validations/
│   │   ├── authSchemas.js
│   │   └── userSchemas.js
│   ├── app.js
│   ├── server.js
│   └── vitest.config.js
│
└── README.md
```

## Requirements

Install before starting:

- Node.js
- npm
- PostgreSQL

## Installation

Clone or copy the template and install dependencies separately for the
client and server.

### Client

```bash
cd client
npm install
```

### Server

```bash
cd server
npm install
```

## Environment variables

Create:

```text
server/.env
```

Example:

```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=your_database

JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=1h
COOKIE_EXPIRES_IN_MS=3600000

CLIENT_ORIGIN=http://localhost:5173
```

Generate a random JWT secret with Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Do not commit `.env` files to Git.

## PostgreSQL database

Create a development database for the application.

Then run the migrations from the server directory:

```bash
npm run migrate
```

The migration runner records executed migration files so the same
migration is not executed twice.

### Creating the first admin

Registration always creates `user` accounts. Create the first admin from
the server directory:

```bash
npm run create-admin
```

The script asks for a username, email, and password. The password is not
shown while typing. When not running in a terminal, provide the password
through the `ADMIN_PASSWORD` environment variable.

## Development

Start the backend:

```bash
cd server
npm run dev
```

By default the backend runs at:

```text
http://localhost:5000
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

By default Vite runs at:

```text
http://localhost:5173
```

The Vite development proxy forwards `/api` requests to the Node.js
backend.

## Authentication

Authentication uses a JWT stored in an HttpOnly cookie.

The frontend does not store the authentication token in `localStorage`
or `sessionStorage`.

The backend loads the user from the database on every authenticated
request, so role changes and account deletions take effect immediately.
Logging out invalidates all of the user's existing tokens, which logs
the user out on every device.

Axios is configured with:

```javascript
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
```

### Authentication endpoints

Method Endpoint Description

---

POST `/api/auth/register` Register a user
POST `/api/auth/login` Log in
POST `/api/auth/logout` Log out
GET `/api/auth/me` Return the authenticated user

## Roles

The template supports:

```text
user
moderator
admin
```

Frontend route protection improves the user experience, but
authorization is always enforced by the backend as well.

### User endpoints

Method Endpoint Access

---

GET `/api/users` moderator, admin
GET `/api/users/:id` moderator, admin
POST `/api/users` admin
PATCH `/api/users/:id/role` admin
DELETE `/api/users/:id` admin

Admins cannot change their own role or delete their own account through
these management endpoints. The last remaining admin cannot be demoted
or deleted.

## Validation

API input is validated with Zod before reaching controllers.

Examples include:

- username length
- email format
- password length
- valid numeric user IDs
- allowed roles

Invalid input returns HTTP `400` with validation details.

## Security

The template includes:

- password hashing with bcrypt
- JWT authentication
- HttpOnly authentication cookies
- role-based backend authorization
- Zod request validation
- Helmet security headers
- rate limiting for authentication endpoints
- centralized error handling
- parameterized PostgreSQL queries

In production, Express is configured to trust the first reverse proxy:

```javascript
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
```

Review this setting when deploying to a hosting environment with a
different proxy topology.

## Testing

The client and server have separate test suites.

### Backend tests

Backend tests use:

- Vitest
- Supertest
- a separate PostgreSQL test database

Create:

```text
server/.env.test
```

Example:

```env
NODE_ENV=test

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=auth_template_test_db

JWT_SECRET=test-secret-key-only-for-tests
JWT_EXPIRES_IN=1h
COOKIE_EXPIRES_IN_MS=3600000
```

Create the test database in PostgreSQL, for example:

```sql
CREATE DATABASE auth_template_test_db;
```

Run migrations against the test database in PowerShell:

```powershell
$env:NODE_ENV="test"
npm run migrate
Remove-Item Env:NODE_ENV
```

Run backend tests:

```bash
cd server
npm test
```

Watch mode:

```bash
npm run test:watch
```

Current backend suite contains 7 authentication tests covering:

- registration
- invalid registration
- successful login
- incorrect password
- authenticated `/me`
- unauthenticated `/me`
- logout

### Frontend tests

Frontend tests use:

- Vitest
- React Testing Library
- `@testing-library/jest-dom`
- `@testing-library/user-event`
- jsdom

Run frontend tests:

```bash
cd client
npm test
```

Watch mode:

```bash
npm run test:watch
```

Current frontend suite contains 6 tests covering:

- unauthenticated protected-route redirect
- authenticated protected-route access
- normal-user admin-route rejection
- admin-route access
- successful login submission and navigation
- failed login error display

At the time this README was created, the template has 13 automated tests
in total.

## Useful npm commands

### Client

```bash
npm run dev
npm run build
npm run lint
npm test
npm run test:watch
```

### Server

```bash
npm run dev
npm start
npm run migrate
npm test
npm run test:watch
```

## Creating a new project from this template

When copying the template for a new application:

1.  Copy the project directory.
2.  Change project names in `package.json` files if needed.
3.  Create a new development PostgreSQL database.
4.  Create a separate test database.
5.  Create new `.env` and `.env.test` files.
6.  Generate a new `JWT_SECRET`.
7.  Install client and server dependencies.
8.  Run database migrations.
9.  Run both test suites.
10. Start implementing project-specific features.

Never reuse a production JWT secret between unrelated projects.

## Production checklist

Before deploying an application based on this template:

- set `NODE_ENV=production`
- use a strong, unique `JWT_SECRET`
- use production PostgreSQL credentials
- configure the allowed CORS origin for the real frontend domain
- verify cookie settings for the deployment architecture
- verify the Express `trust proxy` setting
- run client and server tests
- run the frontend production build
- keep `.env` files out of Git
- use HTTPS

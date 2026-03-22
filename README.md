# Authentication System (Node.js + MongoDB)

This project is a JWT-based authentication system built using Node.js, Express, and MongoDB. It implements access and refresh tokens with rotation, revocation, and basic security practices.

---

## Features

- User registration and login
- Password hashing using bcrypt
- Access token (short-lived)
- Refresh token (long-lived)
- Refresh token rotation (single-use)
- Token revocation (`isRevoked`)
- Logout functionality (idempotent)
- Cookie-based authentication
- Automatic cleanup of expired tokens using MongoDB TTL

---

## Project Structure

```

src/
controllers/     # Handles HTTP requests and responses
services/        # Business logic (auth, token rotation)
models/          # Mongoose schemas
routes/          # Route definitions
middleware/      # Auth middleware
utils/           # Helpers (JWT, cookies, hashing, DB, etc.)

```

---

## API Endpoints

### Auth

- **POST /auth/register**
  - Creates a new user

- **POST /auth/login**
  - Logs in user and sets cookies

- **POST /auth/refresh**
  - Rotates refresh token and issues new tokens

- **POST /auth/logout**
  - Clears cookies and revokes token

---

### User

- **GET /users/me**
  - Returns current user data
  - Requires authentication

---

## How it works

### Login

- User sends username and password
- Server validates credentials
- If valid:
  - Access token is created (15 min)
  - Refresh token is created (7 days)
  - Refresh token is hashed and stored in DB
  - Tokens are sent via HTTP-only cookies

---

### Refresh Token (Rotation)

- Client sends refresh token from cookies
- Server:
  - Verifies token
  - Hashes and finds it in DB
  - Atomically revokes old token
  - Creates new refresh token
  - Stores new hashed token
  - Sends new tokens via cookies

- If token is invalid or reused:
  - All tokens for that user are deleted

---

### Logout

- Reads refresh token (if present)
- Revokes token in DB (best effort)
- Clears cookies
- Always returns success

---

## Database Schema

### User

- name
- username (unique, lowercase, validated)
- password (hashed, hidden using `select: false`)

---

### RefreshToken

- userId (reference to User)
- tokenHash (hashed token)
- expiresAt (with TTL index)
- isRevoked

Expired tokens are automatically deleted using MongoDB TTL.

---

## Security Notes

- Refresh tokens are stored as hashes
- Refresh tokens are single-use (rotation)
- Reuse detection invalidates all sessions
- Cookies are HTTP-only
- Passwords are hashed with bcrypt
- Sensitive fields are excluded from queries

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT
- bcrypt

---

## Setup

1. Clone the repository

2. Install dependencies:

```

npm install

```

3. Create a `.env` file:

```

PORT=your_port
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_secret

```

4. Run the server:

```

npm run dev

```

---

## Notes

- Controllers handle HTTP logic
- Services handle business logic
- Middleware is used for protected routes
- Cookies are used instead of local storage

---

## Possible Improvements

- Rate limiting
- Email verification

---

## License

MIT

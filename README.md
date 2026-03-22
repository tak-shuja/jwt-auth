# Authentication System (Node.js + MongoDB)

This project is a basic authentication system built using Node.js, Express, and MongoDB. It uses JWT for authentication and implements refresh token rotation with security practices.

---

## Features

- User registration and login
- Password hashing
- Access token and refresh token system
- Refresh token rotation
- Token revocation
- Logout functionality
- Cookies for storing tokens
- Automatic cleanup of expired tokens using TTL

---

## How it works

### Login

- User sends username and password
- Server validates credentials
- If valid:
  - Access token is created (short-lived)
  - Refresh token is created (long-lived)
  - Refresh token is stored in database (hashed)
  - Both tokens are sent as cookies

---

### Refresh Token

- Client sends refresh token from cookies
- Server:
  - Verifies the token
  - Checks database for matching hashed token
  - Revokes the old token
  - Creates a new refresh token
  - Stores new token in database
  - Sends new tokens in cookies

- If token is invalid or reused:
  - All tokens for that user are deleted

---

### Logout

- Server reads refresh token (if present)
- Marks it as revoked in database (if valid)
- Clears cookies
- Always returns success

---

## Database Schema

### User

- name
- username (unique, lowercase)
- password (hashed, not selected by default)

### RefreshToken

- userId
- tokenHash
- expiresAt
- isRevoked

Expired tokens are automatically deleted using a TTL index.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT
- bcrypt

---

## Notes

- Refresh tokens are stored as hashes for security
- Services are separated from controllers
- Controllers handle HTTP logic
- Services handle business logic

---

## Possible Improvements

- Add validation for inputs
- Add rate limiting
- Add email verification
- Add session/device tracking
- Add logging

---

## Setup

1. Clone the repository
2. Install dependencies:

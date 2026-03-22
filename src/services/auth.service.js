import { hashToken } from "../../../collab-todo/backend/utils/refreshToken.js";
import { RefreshToken } from "../models/refreshToken.model.js";
import { User } from "../models/user.model.js";
import { APIError } from "../utils/APIError.js";
import { createToken, verifyToken } from "../utils/jwt.js";
import { hashPassword, verifyPasswordHash } from "../utils/password.js";

/**
 * Validates password input.
 * @param {string} password - must be at least 6 characters
 * @throws {APIError} if password is missing or too short
 */
const validatePassword = (password) => {
  if (!password) {
    throw new APIError("Missing password", 400);
  }

  if (password.length < 6) {
    throw new APIError("Password length should be at least 6", 400);
  }
};

/**
 * Validates username input.
 * @param {string} username - must be non-empty (after normalization)
 * @throws {APIError} if username is missing
 */
const validateUsername = (username) => {
  if (!username || !username.trim()) {
    throw new APIError("Missing username", 400);
  }
};

/**
 * Validates name input.
 * @param {string} name - must be non-empty
 * @throws {APIError} if name is missing
 */
const validateName = (name) => {
  if (!name) {
    throw new APIError("Missing name", 400);
  }
};

/**
 * Normalizes username for consistent storage and lookup.
 * @param {string} username
 * @returns {string} trimmed and lowercased username
 */
const normalizeUsername = (username) => {
  return username.trim().toLowerCase();
};

/**
 * Registers a new user after validating input and hashing password.
 * @param {string} name
 * @param {string} username - normalized to lowercase
 * @param {string} password - min 6 characters
 * @returns {Promise<{ id: string}>}
 * @throws {APIError} if validation fails
 *
 * @note Username is trimmed and lowercased before storage
 */

export const registerUser = async (name, username, password) => {
  // normalize username
  const normalizedUsername = normalizeUsername(username);

  // validate fields
  validateName(name);
  validatePassword(password);
  validateUsername(normalizedUsername);

  // check if the username already exists
  const user = await User.exists({ username: normalizedUsername });

  if (user) {
    throw new APIError("User already exists", 409);
  }

  // hash password
  const hashedPassword = await hashPassword(password);

  // create a new user and push it to database
  const newUser = await User.create({
    name,
    username: normalizedUsername,
    password: hashedPassword,
  });

  return { id: newUser._id };
};

/**
 * Logs in a user after validating credentials.
 * @param {string} username - normalized to lowercase
 * @param {string} password - min 6 characters
 * @returns {Promise<{ id: string}>}
 * @throws {APIError} if validation fails
 *
 * @note Username is trimmed and lowercased before processing
 */

export const loginUser = async (username, password) => {
  // normalize username
  const normalizedUsername = normalizeUsername(username);

  // validate fields
  validateUsername(normalizedUsername);
  validatePassword(password);

  // get the user details from the database
  const user = await User.findOne(
    { username: normalizedUsername },
    "username password",
  );

  // check if the user exists in the database
  if (!user) {
    throw new APIError("Invalid credentials", 401);
  }

  // compare the password
  const storedHash = user.password;

  const isPasswordValid = await verifyPasswordHash(password, storedHash);

  if (!isPasswordValid) {
    throw new APIError("Invalid credentials", 401);
  }

  // return the user id
  return { id: user._id };
};

export const rotateToken = async (token) => {
  if (!token) {
    throw new APIError("Token required", 401);
  }

  let decoded;
  try {
    decoded = await verifyToken(token);
  } catch {
    throw new APIError("Invalid or expired tosken", 403);
  }

  const hashed = hashToken(token);

  const storedToken = await RefreshToken.findOneAndUpdate(
    {
      userId: decoded.uid,
      tokenHash: hashed,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    },
    { $set: { isRevoked: true } },
  );

  if (!storedToken) {
    await RefreshToken.deleteMany({ userId: decoded.uid });
    throw new APIError("Invalid or expired token", 403);
  }

  const payload = { uid: decoded.uid };

  const newRefreshToken = createToken(payload, "7d");

  // store the new refresh token
  await RefreshToken.create({
    userId: decoded.uid,
    tokenHash: hashToken(newRefreshToken),
  });

  return {
    payload,
    refreshToken: newRefreshToken,
  };
};

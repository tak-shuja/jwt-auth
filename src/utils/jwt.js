import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET;

export const createToken = (data, expiresIn = "15m") => {
  return jwt.sign(data, JWT_SECRET, { expiresIn: expiresIn });
};

export const verifyToken = async (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

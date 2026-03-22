import { APIError } from "../utils/APIError.js";
import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies["access-token"];

    if (!token) {
      throw new APIError("Unauthorized", 401);
    }
    const decoded = await verifyToken(token);
    req.user = { id: decoded.uid };
    next();
  } catch (err) {
    return res.status(err.status || 401).json({
      message: err.message,
    });
  }
};

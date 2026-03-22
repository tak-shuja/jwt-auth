import { RefreshToken } from "../models/refreshToken.model.js";
import { User } from "../models/user.model.js";
import {
  loginUser,
  registerUser,
  rotateToken,
} from "../services/auth.service.js";
import { APIError } from "../utils/APIError.js";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "../utils/cookies.js";
import { createToken, hashToken, verifyToken } from "../utils/jwt.js";

const createTokens = (payload) => {
  const accessToken = createToken(payload);
  const refreshToken = createToken(payload, "7d");
  return { accessToken, refreshToken };
};

const setCookies = (res, accessToken, refreshToken) => {
  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);
};

export const register = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    const newUser = await registerUser(name, username, password);

    const { accessToken, refreshToken } = createTokens({ uid: newUser.id });

    setCookies(res, accessToken, refreshToken);

    await RefreshToken.create({
      userId: newUser.id,
      tokenHash: hashToken(refreshToken),
    });

    return res.status(201).json({
      message: "User Created",
      data: { id: newUser.id },
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await loginUser(username, password);

    const { accessToken, refreshToken } = createTokens({ uid: user.id });

    setCookies(res, accessToken, refreshToken);

    await RefreshToken.create({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
    });

    return res.status(200).json({
      message: "Login successfull",
      data: { id: user.id },
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies["refresh-token"];

    if (refreshToken) {
      try {
        const decoded = await verifyToken(refreshToken);
        const hashed = hashToken(refreshToken);

        await RefreshToken.updateOne(
          {
            userId: decoded.uid,
            tokenHash: hashed,
          },
          { $set: { isRevoked: true } },
        );
      } catch {}
    }

    res.clearCookie("access-token");
    res.clearCookie("refresh-token");

    return res.status(200).json({
      message: "Logged out",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies["refresh-token"];

    const { payload, refreshToken: newRefreshToken } =
      await rotateToken(refreshToken);

    const { accessToken } = createTokens(payload);

    setCookies(res, accessToken, newRefreshToken);

    return res.status(200).json({ message: "Token rotated" });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message,
    });
  }
};

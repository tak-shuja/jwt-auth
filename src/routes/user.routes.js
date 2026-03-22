import express from "express";
import { getCurrentUser } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.get("/me", authMiddleware, getCurrentUser);

export default userRouter;

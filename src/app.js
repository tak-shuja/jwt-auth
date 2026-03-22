import express from "express";
import "./utils/dotenv.js";
import { connectDB } from "./utils/db.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// connect to db
await connectDB();

// setup middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
    credentials: true,
  }),
);
// routing
app.use("/users", userRouter);
app.use("/auth", authRouter);

export default app;

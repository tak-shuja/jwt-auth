import express from "express";
import "./utils/dotenv.js";
import { connectDB } from "./utils/db.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";

const app = express();

// connect to db
await connectDB();

// setup middleware
app.use(express.json());

// routing
app.use("/users", userRouter);
app.use("/auth", authRouter);

export default app;

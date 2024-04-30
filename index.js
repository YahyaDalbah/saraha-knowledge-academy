import "dotenv/config";
import express from "express";
import { connectDB } from "./DB/connection.js";
import authRouter from "./api/auth.router.js";
import userRouter from "./api/user.router.js";
import messageRouter from "./api/message.router.js";
const app = express();
const PORT = 3000;
await connectDB();
app.use(express.json());
app.use("/auth", authRouter)
app.use("/user",userRouter)
app.use("/message",messageRouter)
app.listen(PORT, () => {
  console.log("server listening on 3000");
});


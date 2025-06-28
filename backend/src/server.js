import express from "express"
import "dotenv/config"
import authRoutes from "./routes/authRoutes.js"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import cors from "cors";
const app = express();
const port=process.env.PORT;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/chat",chatRoutes)

app.listen(port,()=>{
    console.log(`server is running on ${port}`)
    connectDB()
})
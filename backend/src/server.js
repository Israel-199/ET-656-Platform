import express from "express";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import cors from "cors";
import path from "path";

const app = express();
const port = process.env.PORT;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const __dirname = path.resolve();

app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://et-656-platform.vercel.app",
    ],
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// Health route
app.get("/api/health", (req, res) => {
  res.status(200).send("OK");
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`server is running on ${port}`);
  connectDB();

  // Self-ping every 10 minutes (works only while the server is already running)
  const APP_URL = process.env.APP_URL;

  if (APP_URL) {
    setInterval(async () => {
      try {
        await fetch(`${APP_URL}/api/health`);
        console.log("Self-ping successful");
      } catch (err) {
        console.error("Self-ping failed:", err.message);
      }
    }, 10 * 60 * 1000);
  }
});
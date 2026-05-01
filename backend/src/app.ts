import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { authRoutes } from "./modules/auth/auth.routes";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes";
import { projectRoutes } from "./modules/projects/project.routes";
import { taskRoutes } from "./modules/tasks/task.routes";

export const app = express();

// Trust proxy (Railway / production)
app.set("trust proxy", 1);

// Security
app.use(helmet());

// ✅ FINAL CORS FIX
const allowedOrigins = [
  "http://localhost:5173",
  env.FRONTEND_URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

// Body parser
app.use(express.json({ limit: "1mb" }));

// Rate limiter
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/dashboard", dashboardRoutes);

// Error handler
app.use(errorMiddleware);
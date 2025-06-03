import express from "express";
import cors from "cors";
import path from "path";

import usersRoutes from "./routes/users.routes.js";
import eventsRoutes from "./routes/events.routes.js";
import { initializeDatabase } from "./database.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://splendid-bombolone-72e490.netlify.app",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static file serving with proper path handling
const publicPath = path.join(process.cwd(), "public");
app.use(express.static(publicPath));
app.use("/images", express.static(path.join(publicPath, "images")));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/users", usersRoutes);
app.use("/events", eventsRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Event Management API is running",
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Event Management API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      users: "/users",
      events: "/events",
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("💥 Error:", err.message);
    console.error("Stack:", err.stack);
    res.status(500).json({
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    });
  }
);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);

  // Initialize database
  try {
    initializeDatabase();
    console.log("✅ Database initialized successfully");
  } catch (err) {
    console.error("❌ Failed to initialize database:", err);
    process.exit(1);
  }
});

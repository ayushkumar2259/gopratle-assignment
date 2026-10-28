const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { env } = require("./config/env");
const healthRoutes = require("./routes/healthRoutes");
const requirementRoutes = require("./routes/requirementRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || env.frontendOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error("This origin is not allowed by CORS."));
      },
      methods: ["GET", "POST", "OPTIONS"],
    })
  );
  app.use(express.json({ limit: "100kb" }));
  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: "Too many requests. Please try again later." },
    })
  );

  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "GoPratle Requirements API",
      endpoints: {
        health: "GET /api/health",
        create: "POST /api/requirements",
        getById: "GET /api/requirements/:id",
      },
    });
  });

  app.use("/api/health", healthRoutes);
  app.use("/api/requirements", requirementRoutes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { downloadRouter } = require("./routes/download");

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(',').map(o => o.trim()) || [
        'http://localhost:5173',
        'http://localhost:3000'
      ],
    })
  );
  app.use(express.json({ limit: "10kb" }));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 60,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api", downloadRouter);

  app.use((err, _req, res, _next) => {
    const status = err.status || 500;
    res.status(status).json({
      status: "error",
      message: err.message || "Something went wrong.",
    });
  });

  return app;
}

module.exports = { createApp };


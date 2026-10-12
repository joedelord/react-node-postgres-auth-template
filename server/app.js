const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const pool = require("./config/db");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

const errorHandler = require("./middleware/errorHandler");

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/api", (req, res) => {
  res.json({
    message: "Backend working fine!",
  });
});

app.get("/api/test-db", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT NOW()");

    return res.json({
      connected: true,
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    return next(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;

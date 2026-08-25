const express = require("express");

const {
  register,
  login,
  logout,
  getCurrentUser,
} = require("../controllers/authController");

const { requireAuth } = require("../middleware/authMiddleware");

const { loginLimiter, registerLimiter } = require("../middleware/rateLimiters");

const validate = require("../middleware/validate");

const { registerSchema, loginSchema } = require("../validations/authSchemas");

const router = express.Router();

router.post("/register", registerLimiter, validate(registerSchema), register);

router.post("/login", loginLimiter, validate(loginSchema), login);

router.post("/logout", logout);

router.get("/me", requireAuth, getCurrentUser);

module.exports = router;

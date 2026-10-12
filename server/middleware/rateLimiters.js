const { rateLimit } = require("express-rate-limit");

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

// Limits are off in tests unless a test turns them on to check them.
const skipInTests = () => {
  return process.env.NODE_ENV === "test" && process.env.RATE_LIMITS !== "on";
};

const createLimiter = ({ message, ...options }) => {
  return rateLimit({
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skip: skipInTests,
    message: {
      error: message,
    },
    ...options,
  });
};

// Keyed on the validated, lowercased email, so limiters using this must run
// after validate().
const byEmail = (req) => req.body.email;

const loginLimiter = createLimiter({
  windowMs: FIFTEEN_MINUTES,
  limit: 10,
  message: "Too many login attempts. Please try again later.",
});

// Counts only failed logins, so it stops guessing against one account from
// many IP addresses without affecting the account owner's successful logins.
const loginEmailLimiter = createLimiter({
  windowMs: FIFTEEN_MINUTES,
  limit: 5,
  skipSuccessfulRequests: true,
  keyGenerator: byEmail,
  message: "Too many failed login attempts. Please try again later.",
});

const registerLimiter = createLimiter({
  windowMs: ONE_HOUR,
  limit: 10,
  message: "Too many registration attempts. Please try again later.",
});

const passwordResetLimiter = createLimiter({
  windowMs: ONE_HOUR,
  limit: 10,
  message: "Too many password reset attempts. Please try again later.",
});

// Stops one inbox from being flooded with reset emails.
const passwordResetEmailLimiter = createLimiter({
  windowMs: ONE_HOUR,
  limit: 3,
  keyGenerator: byEmail,
  message: "Too many password reset requests. Please try again later.",
});

// Keyed on the user, so it must run after requireAuth.
const changePasswordLimiter = createLimiter({
  windowMs: FIFTEEN_MINUTES,
  limit: 5,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => String(req.user.id),
  message: "Too many password change attempts. Please try again later.",
});

module.exports = {
  loginLimiter,
  loginEmailLimiter,
  registerLimiter,
  passwordResetLimiter,
  passwordResetEmailLimiter,
  changePasswordLimiter,
};

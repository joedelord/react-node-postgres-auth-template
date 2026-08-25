const { verifyToken } = require("../utils/token");

const requireAuth = (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  try {
    const payload = verifyToken(token);

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired authentication token",
    });
  }
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Insufficient permissions",
      });
    }

    return next();
  };
};

module.exports = {
  requireAuth,
  requireRole,
};

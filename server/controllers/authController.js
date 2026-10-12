const authModel = require("../models/authModel");
const {
  createUserAccount,
  authenticate,
  toPublicUser,
} = require("../services/userService");
const { createToken, verifyToken } = require("../utils/token");

const COOKIE_NAME = "auth_token";

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: Number(process.env.COOKIE_EXPIRES_IN_MS) || 3600000,
});

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = await createUserAccount({ username, email, password });

    const token = createToken(user);

    res.cookie(COOKIE_NAME, token, getCookieOptions());

    return res.status(201).json({
      user: toPublicUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authenticate(email, password);

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = createToken(user);

    res.cookie(COOKIE_NAME, token, getCookieOptions());

    return res.json({
      user: toPublicUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

// Bumping the token version invalidates every token issued to the user, so a
// copied cookie stops working after logout.
const logout = async (req, res, next) => {
  try {
    const token = req.cookies[COOKIE_NAME];

    if (token) {
      let payload = null;

      try {
        payload = verifyToken(token);
      } catch (error) {
        // An invalid or expired token has nothing left to revoke.
      }

      if (payload) {
        await authModel.incrementTokenVersion(payload.sub);
      }
    }

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.json({
      message: "Logged out",
    });
  } catch (error) {
    return next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await authModel.findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.json({
      user,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
};

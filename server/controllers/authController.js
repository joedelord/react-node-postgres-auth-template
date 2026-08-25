const bcrypt = require("bcryptjs");

const authModel = require("../models/authModel");
const { createToken } = require("../utils/token");

const COOKIE_NAME = "auth_token";
const SALT_ROUNDS = 12;

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: Number(process.env.COOKIE_EXPIRES_IN_MS) || 3600000,
});

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingEmail = await authModel.findUserByEmail(email);

    if (existingEmail) {
      return res.status(409).json({
        error: "Email is already in use",
      });
    }

    const existingUsername = await authModel.findUserByUsername(username);

    if (existingUsername) {
      return res.status(409).json({
        error: "Username is already in use",
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await authModel.createUser({
      username,
      email,
      passwordHash,
    });

    const token = createToken(user);

    res.cookie(COOKIE_NAME, token, getCookieOptions());

    return res.status(201).json({
      user,
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authModel.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = createToken(user);

    res.cookie(COOKIE_NAME, token, getCookieOptions());

    return res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.json({
    message: "Logged out",
  });
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

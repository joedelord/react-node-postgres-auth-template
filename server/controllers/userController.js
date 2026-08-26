const userModel = require("../models/userModel");
const authModel = require("../models/authModel");

const getUsers = async (req, res, next) => {
  try {
    const users = await userModel.getAllUsers();

    return res.json(users);
  } catch (error) {
    return next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userModel.getUserById(req.validatedParams.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.json(user);
  } catch (error) {
    return next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const userId = req.validatedParams.id;
    const { role } = req.body;

    if (userId === Number(req.user.id)) {
      return res.status(400).json({
        error: "You cannot change your own role",
      });
    }

    const user = await userModel.updateUserRole(userId, role);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.json({
      message: "User role updated",
      user,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.validatedParams.id;
    const currentUserId = Number(req.user.id);

    if (userId === currentUserId) {
      return res.status(400).json({
        error: "You cannot delete your own account",
      });
    }

    const user = await userModel.deleteUser(userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.json({
      message: "User deleted",
      user,
    });
  } catch (error) {
    return next(error);
  }
};

const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 12;

const createUser = async (req, res, next) => {
  try {
    const { username, email, password, role = "user" } = req.body;

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
      role,
    });

    return res.status(201).json({
      user,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserRole,
  deleteUser,
};

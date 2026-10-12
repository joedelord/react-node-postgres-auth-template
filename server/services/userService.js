const bcrypt = require("bcryptjs");

const authModel = require("../models/authModel");
const HttpError = require("../utils/httpError");

const SALT_ROUNDS = 12;
const UNIQUE_VIOLATION = "23505";

// Compared against when no user matches the email, so a failed login takes
// the same time whether or not the account exists.
const DUMMY_PASSWORD_HASH = bcrypt.hashSync("dummy-password", SALT_ROUNDS);

const createUserAccount = async ({ username, email, password, role }) => {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    return await authModel.createUser({
      username,
      email,
      passwordHash,
      role,
    });
  } catch (error) {
    if (error.code === UNIQUE_VIOLATION) {
      const field = error.constraint?.includes("email") ? "Email" : "Username";

      throw new HttpError(409, `${field} is already in use`);
    }

    throw error;
  }
};

const authenticate = async (email, password) => {
  const user = await authModel.findUserByEmail(email);

  const passwordMatches = await bcrypt.compare(
    password,
    user ? user.password_hash : DUMMY_PASSWORD_HASH,
  );

  if (!user || !passwordMatches) {
    return null;
  }

  const { password_hash, ...safeUser } = user;

  return safeUser;
};

module.exports = {
  createUserAccount,
  authenticate,
};

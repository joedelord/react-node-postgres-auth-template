const pool = require("../config/db");

const findUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT
      id,
      username,
      email,
      password_hash,
      role,
      created_at,
      updated_at
    FROM users
    WHERE LOWER(email) = LOWER($1)`,
    [email],
  );

  return result.rows[0];
};

const findUserByUsername = async (username) => {
  const result = await pool.query(
    `SELECT
      id,
      username,
      email,
      password_hash,
      role,
      created_at,
      updated_at
    FROM users
    WHERE LOWER(username) = LOWER($1)`,
    [username],
  );

  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await pool.query(
    `SELECT
      id,
      username,
      email,
      role,
      created_at,
      updated_at
    FROM users
    WHERE id = $1`,
    [id],
  );

  return result.rows[0];
};

const createUser = async ({ username, email, passwordHash, role = "user" }) => {
  const result = await pool.query(
    `INSERT INTO users (
      username,
      email,
      password_hash,
      role
    )
    VALUES ($1, $2, $3, $4)
    RETURNING
      id,
      username,
      email,
      role,
      created_at,
      updated_at`,
    [username, email, passwordHash, role],
  );

  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  findUserByUsername,
  findUserById,
  createUser,
};

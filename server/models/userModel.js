const pool = require("../config/db");

const getAllUsers = async () => {
  const result = await pool.query(`
    SELECT
      id,
      username,
      email,
      role,
      created_at,
      updated_at
    FROM users
    ORDER BY id
  `);

  return result.rows;
};

const getUserById = async (id) => {
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

const updateUserRole = async (id, role) => {
  const result = await pool.query(
    `UPDATE users
     SET
       role = $1,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING
       id,
       username,
       email,
       role,
       created_at,
       updated_at`,
    [role, id],
  );

  return result.rows[0];
};

const deleteUser = async (id) => {
  const result = await pool.query(
    `DELETE FROM users
     WHERE id = $1
     RETURNING
       id,
       username,
       email,
       role`,
    [id],
  );

  return result.rows[0];
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
};

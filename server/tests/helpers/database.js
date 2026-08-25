const pool = require("../../config/db");

const clearDatabase = async () => {
  await pool.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
};

module.exports = {
  clearDatabase,
};

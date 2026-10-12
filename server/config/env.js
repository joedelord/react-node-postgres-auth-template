const path = require("path");
const dotenv = require("dotenv");

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

dotenv.config({
  path: path.resolve(process.cwd(), envFile),
});

process.env.CLIENT_ORIGIN ??= "http://localhost:5173";

const REQUIRED_VARIABLES = [
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "JWT_SECRET",
];

const missingVariables = REQUIRED_VARIABLES.filter(
  (name) => !process.env[name],
);

if (missingVariables.length > 0) {
  throw new Error(
    `Missing required environment variables in ${envFile}: ${missingVariables.join(", ")}`,
  );
}

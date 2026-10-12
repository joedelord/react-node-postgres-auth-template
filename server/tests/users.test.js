const request = require("supertest");

const app = require("../app");
const pool = require("../config/db");

const { createUserAccount } = require("../services/userService");
const { clearDatabase } = require("./helpers/database");

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await pool.end();
});

const loginAs = async (role) => {
  await createUserAccount({
    username: `${role}user`,
    email: `${role}@example.com`,
    password: "password123",
    role,
  });

  const agent = request.agent(app);

  await agent.post("/api/auth/login").send({
    email: `${role}@example.com`,
    password: "password123",
  });

  return agent;
};

describe("User management", () => {
  test("rejects duplicate usernames regardless of case", async () => {
    await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "first@example.com",
      password: "password123",
    });

    const response = await request(app).post("/api/auth/register").send({
      username: "TestUser",
      email: "second@example.com",
      password: "password123",
    });

    expect(response.status).toBe(409);

    expect(response.body).toEqual({
      error: "Username is already in use",
    });
  });

  test("validates admin user creation", async () => {
    const admin = await loginAs("admin");

    const response = await admin.post("/api/users").send({
      username: "newuser",
      email: "new@example.com",
      role: "superuser",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation failed");
  });

  test("applies role changes without waiting for token expiry", async () => {
    const admin = await loginAs("admin");

    expect((await admin.get("/api/users")).status).toBe(200);

    await pool.query("UPDATE users SET role = 'user' WHERE username = 'adminuser'");

    const response = await admin.get("/api/users");

    expect(response.status).toBe(403);
  });

  test("rejects tokens of deleted users", async () => {
    const admin = await loginAs("admin");

    await pool.query("DELETE FROM users WHERE username = 'adminuser'");

    const response = await admin.get("/api/auth/me");

    expect(response.status).toBe(401);
  });
});

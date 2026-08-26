const { z } = require("zod");

const userIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("User ID must be a positive integer"),
  }),
});

const updateUserRoleSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("User ID must be a positive integer"),
  }),

  body: z.object({
    role: z.enum(["user", "moderator", "admin"], {
      error: "Invalid role",
    }),
  }),
});

const createUserSchema = z.object({
  body: z.object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(100),

    email: z.email("Invalid email address").trim().toLowerCase(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128),

    role: z.enum(["user", "moderator", "admin"]).default("user"),
  }),
});

module.exports = {
  userIdSchema,
  updateUserRoleSchema,
  createUserSchema,
};

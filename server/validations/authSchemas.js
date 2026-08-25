const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(100, "Username must be at most 100 characters"),

    email: z.email("Invalid email address").trim().toLowerCase(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be at most 128 characters"),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address").trim().toLowerCase(),

    password: z.string().min(1, "Password is required"),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};

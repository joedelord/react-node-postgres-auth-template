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

module.exports = {
  userIdSchema,
  updateUserRoleSchema,
};

import { z } from "zod";

const teamRoleSchema = z.enum(["admin", "sales"]);

export const inviteTeamMemberSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name must not exceed 80 characters"),

    email: z
      .string()
      .trim()
      .email("Please provide a valid email address")
      .max(160, "Email is too long")
      .transform((value) => value.toLowerCase()),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be at most 72 characters"),

    role: teamRoleSchema,
  })
  .strict();

export const updateTeamMemberSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name must not exceed 80 characters")
      .optional(),

    role: teamRoleSchema.optional(),

    isActive: z.boolean().optional(),
  })
  .strict();

import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

const followUpTypeSchema = z.enum([
  "call",
  "message",
  "email",
  "meeting",
  "other",
]);

const followUpStatusSchema = z.enum(["scheduled", "completed", "cancelled"]);

const scheduledAtSchema = z.string().datetime({
  offset: true,
});

export const createFollowUpSchema = z.object({
  lead: objectIdSchema,

  type: followUpTypeSchema,

  scheduledAt: scheduledAtSchema,

  notes: z
    .string()
    .trim()
    .max(2000, "Notes must be at most 2000 characters")
    .nullable()
    .optional(),
});

export const updateFollowUpSchema = z
  .object({
    type: followUpTypeSchema.optional(),

    scheduledAt: scheduledAtSchema.optional(),

    status: followUpStatusSchema.optional(),

    notes: z
      .string()
      .trim()
      .max(2000, "Notes must be at most 2000 characters")
      .nullable()
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update a follow-up",
  });

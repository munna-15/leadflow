import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

const nullableString = (maxLength) =>
  z.string().trim().max(maxLength).nullable().optional();

export const createLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Lead name must be at least 2 characters")
    .max(120, "Lead name must be at most 120 characters"),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .transform((value) => value.toLowerCase())
    .nullable()
    .optional(),

  phone: nullableString(30),

  source: z.string().trim().min(1, "Source cannot be empty").max(50).optional(),

  status: z
    .enum([
      "new",
      "qualified",
      "contacted",
      "meeting",
      "negotiation",
      "won",
      "lost",
    ])
    .optional(),

  temperature: z.enum(["hot", "warm", "cold"]).optional(),

  score: z.number().int().min(0).max(100).optional(),

  requirements: z.record(z.string(), z.unknown()).optional(),

  aiSummary: nullableString(2000),

  assignedTo: objectIdSchema.nullable().optional(),

  nextFollowUpAt: z.string().datetime().nullable().optional(),
});

export const updateLeadSchema = createLeadSchema.partial();

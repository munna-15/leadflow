import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

const nullableString = (maxLength) =>
  z.string().trim().max(maxLength).nullable().optional();

const leadStatusSchema = z.enum([
  "new",
  "qualified",
  "contacted",
  "meeting",
  "negotiation",
  "won",
  "lost",
]);

const leadTemperatureSchema = z.enum(["hot", "warm", "cold"]);

const leadFields = {
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

  source: z
    .string()
    .trim()
    .min(1, "Source cannot be empty")
    .max(50, "Source must be at most 50 characters")
    .optional(),

  status: leadStatusSchema.optional(),

  temperature: leadTemperatureSchema.optional(),

  score: z
    .number()
    .int()
    .min(0, "Score cannot be below 0")
    .max(100, "Score cannot be above 100")
    .optional(),

  requirements: z.record(z.string(), z.unknown()).optional(),

  aiSummary: nullableString(2000),

  assignedTo: objectIdSchema.nullable().optional(),

  nextFollowUpAt: z.string().datetime().nullable().optional(),
};

export const createLeadSchema = z.object(leadFields);

export const updateLeadSchema = z
  .object(leadFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update a lead",
  });

import { z } from "zod";

const booleanField = z.boolean();

const scoringMode = z.enum(["balanced", "intent", "engagement"]);

const timezone = z
  .string()
  .trim()
  .min(1, "Timezone is required")
  .max(100, "Timezone is too long");

export const updateAccountSettingsSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name must not exceed 80 characters")
      .optional(),

    email: z
      .string()
      .trim()
      .email("Please provide a valid email address")
      .max(160, "Email is too long")
      .optional(),

    timezone: timezone.optional(),
  })
  .strict();

export const updateWorkspaceSettingsSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Business name is required")
      .max(120, "Business name must not exceed 120 characters")
      .optional(),

    industry: z
      .string()
      .trim()
      .min(1, "Industry is required")
      .max(100, "Industry must not exceed 100 characters")
      .optional(),

    website: z
      .string()
      .trim()
      .url("Please provide a valid website URL")
      .max(500, "Website URL is too long")
      .optional(),

    location: z
      .string()
      .trim()
      .min(1, "Business location is required")
      .max(200, "Business location must not exceed 200 characters")
      .optional(),
  })
  .strict();

export const updateNotificationSettingsSchema = z
  .object({
    inApp: booleanField.optional(),

    email: booleanField.optional(),

    browser: booleanField.optional(),

    teamActivity: booleanField.optional(),
  })
  .strict();

export const updateAIPreferencesSchema = z
  .object({
    automaticQualification: booleanField.optional(),

    leadSummary: booleanField.optional(),

    suggestedNextAction: booleanField.optional(),

    scoringMode: scoringMode.optional(),
  })
  .strict();

export const updateSettingsSchema = z
  .object({
    account: updateAccountSettingsSchema.optional(),

    workspace: updateWorkspaceSettingsSchema.optional(),

    notifications: updateNotificationSettingsSchema.optional(),

    ai: updateAIPreferencesSchema.optional(),
  })
  .strict();

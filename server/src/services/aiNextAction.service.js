import mongoose from "mongoose";

import Lead from "../models/lead.model.js";
import FollowUp from "../models/followUp.model.js";
import Activity from "../models/activity.model.js";

import { generateStructuredAIResponse } from "../ai/ai.service.js";

import { GEMINI_MODEL } from "../ai/ai.config.js";

import AppError from "../utils/AppError.js";

const AI_PROVIDER = "gemini";

const nextActionSchema = {
  type: "object",
  properties: {
    action: {
      type: "string",
      enum: [
        "call",
        "message",
        "email",
        "schedule_follow_up",
        "review_lead",
        "wait",
      ],
    },
    timing: {
      type: "string",
      enum: ["now", "today", "tomorrow", "this_week", "scheduled", "no_action"],
    },
    priority: {
      type: "string",
      enum: ["high", "medium", "low"],
    },
    reason: {
      type: "string",
    },
    message: {
      type: "string",
    },
    confidence: {
      type: "integer",
      minimum: 0,
      maximum: 100,
    },
  },
  required: ["action", "timing", "priority", "reason", "message", "confidence"],
};

const normalizeString = (value) => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return normalized || null;
};

const normalizeRequirements = (requirements) => {
  if (!requirements || typeof requirements !== "object") {
    return {};
  }

  return requirements;
};

const validateRecommendation = (recommendation) => {
  if (!recommendation || typeof recommendation !== "object") {
    throw new AppError(
      "AI returned an invalid next-action recommendation",
      502,
    );
  }

  const allowedActions = new Set([
    "call",
    "message",
    "email",
    "schedule_follow_up",
    "review_lead",
    "wait",
  ]);

  const allowedTimings = new Set([
    "now",
    "today",
    "tomorrow",
    "this_week",
    "scheduled",
    "no_action",
  ]);

  const allowedPriorities = new Set(["high", "medium", "low"]);

  if (!allowedActions.has(recommendation.action)) {
    throw new AppError("AI returned an invalid next action", 502);
  }

  if (!allowedTimings.has(recommendation.timing)) {
    throw new AppError("AI returned an invalid action timing", 502);
  }

  if (!allowedPriorities.has(recommendation.priority)) {
    throw new AppError("AI returned an invalid action priority", 502);
  }

  if (
    typeof recommendation.reason !== "string" ||
    !recommendation.reason.trim()
  ) {
    throw new AppError("AI returned an invalid action reason", 502);
  }

  if (
    typeof recommendation.message !== "string" ||
    !recommendation.message.trim()
  ) {
    throw new AppError("AI returned an invalid action message", 502);
  }

  const confidence = Number(recommendation.confidence);

  if (!Number.isInteger(confidence) || confidence < 0 || confidence > 100) {
    throw new AppError("AI returned an invalid confidence score", 502);
  }

  return {
    action: recommendation.action,
    timing: recommendation.timing,
    priority: recommendation.priority,
    reason: recommendation.reason.trim(),
    message: recommendation.message.trim(),
    confidence,
  };
};

export const suggestNextAction = async ({
  leadId,
  businessId,
  businessContext = null,
}) => {
  if (!mongoose.isValidObjectId(leadId)) {
    throw new AppError("Invalid lead ID", 400);
  }

  if (!mongoose.isValidObjectId(businessId)) {
    throw new AppError("Invalid business ID", 400);
  }

  const lead = await Lead.findOne({
    _id: leadId,
    businessId,
  }).lean();

  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  const [followUps, activities] = await Promise.all([
    FollowUp.find({
      lead: lead._id,
      businessId,
    })
      .sort({ scheduledAt: -1 })
      .limit(10)
      .lean(),

    Activity.find({
      lead: lead._id,
      businessId,
    })
      .sort({ createdAt: -1 })
      .limit(15)
      .lean(),
  ]);

  const leadContext = {
    id: lead._id.toString(),
    name: lead.name,
    email: normalizeString(lead.email),
    phone: normalizeString(lead.phone),
    source: normalizeString(lead.source),
    status: lead.status,
    temperature: lead.temperature,
    score: lead.score,
    requirements: normalizeRequirements(lead.requirements),
    aiIntent: normalizeString(lead.aiIntent),
    aiSummary: normalizeString(lead.aiSummary),
    nextFollowUpAt: lead.nextFollowUpAt,
    aiQualifiedAt: lead.aiQualifiedAt,
  };

  const followUpContext = followUps.map((followUp) => ({
    id: followUp._id.toString(),
    type: followUp.type,
    scheduledAt: followUp.scheduledAt,
    status: followUp.status,
    notes: normalizeString(followUp.notes),
    completedAt: followUp.completedAt,
    createdAt: followUp.createdAt,
  }));

  const activityContext = activities.map((activity) => ({
    type: activity.type,
    title: activity.title,
    description: activity.description,
    metadata: activity.metadata || {},
    createdAt: activity.createdAt,
  }));

  const prompt = `
You are the sales decision-support layer of LeadFlow.

Your task is to recommend the single most useful next action for a sales user working on a lead.

Do not perform the action.
Do not invent facts.
Do not assume information that is not present.
Use only the provided lead, follow-up, activity, and business context.

LEAD:
${JSON.stringify(leadContext, null, 2)}

FOLLOW-UPS:
${JSON.stringify(followUpContext, null, 2)}

RECENT ACTIVITIES:
${JSON.stringify(activityContext, null, 2)}

BUSINESS CONTEXT:
${businessContext || "Not provided"}

DECISION RULES:

1. Prioritize existing overdue or immediately due follow-ups.
2. If a scheduled follow-up already exists, consider that before recommending another follow-up.
3. Consider lead score and temperature as signals, not absolute decisions.
4. Consider AI intent, requirements, and summary when available.
5. Consider recent activities to avoid recommending an action that was already completed without a new reason.
6. A high-intent lead with no recent follow-up may justify direct contact.
7. If the available data does not support an immediate action, recommend review or wait instead.
8. Never invent a conversation, appointment, requirement, budget, location, or customer behavior.
9. Keep the reason concise and directly tied to available evidence.
10. The message should be a practical instruction for the sales user.
11. Confidence must reflect how strongly the available data supports the recommendation.
12. Return exactly one recommended action.

ACTION DEFINITIONS:

- call: Recommend calling the lead.
- message: Recommend sending a direct message.
- email: Recommend sending an email.
- schedule_follow_up: Recommend creating a future follow-up.
- review_lead: Recommend reviewing the lead before taking action.
- wait: Recommend no immediate action.

TIMING DEFINITIONS:

- now: Action should happen immediately.
- today: Action should happen today.
- tomorrow: Action should happen tomorrow.
- this_week: Action should happen sometime this week.
- scheduled: An existing scheduled follow-up is already the relevant next action.
- no_action: No immediate action is recommended.

Return only the structured JSON response matching the provided schema.
`;

  let recommendation;

  try {
    recommendation = await generateStructuredAIResponse({
      prompt,
      schema: nextActionSchema,
      systemInstruction:
        "You are a precise sales decision-support system. Never invent facts and return only the requested structured JSON.",
      model: GEMINI_MODEL,
    });
  } catch (error) {
    console.error("AI next-action generation failed:", error);

    throw new AppError(
      "Unable to generate the next-action recommendation right now",
      502,
    );
  }

  const validatedRecommendation = validateRecommendation(recommendation);

  return {
    ...validatedRecommendation,
    provider: AI_PROVIDER,
    model: GEMINI_MODEL,
    generatedAt: new Date(),
    lead: {
      _id: lead._id,
      name: lead.name,
      score: lead.score,
      temperature: lead.temperature,
      status: lead.status,
    },
  };
};

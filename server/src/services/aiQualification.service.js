import AppError from "../utils/AppError.js";

import { generateStructuredAIResponse } from "../ai/ai.service.js";
import { GEMINI_MODEL } from "../ai/ai.config.js";

const AI_PROVIDER = "gemini";

const qualificationSchema = {
  type: "object",
  properties: {
    intent: {
      type: "string",
      description:
        "The primary business intent explicitly expressed or strongly supported by the lead information.",
    },

    score: {
      type: "number",
      minimum: 0,
      maximum: 100,
      description:
        "Lead quality and purchase/action intent score from 0 to 100.",
    },

    temperature: {
      type: "string",
      enum: ["hot", "warm", "cold"],
      description:
        "Lead temperature based on explicit intent, urgency, and buying or action signals.",
    },

    requirements: {
      type: "object",
      properties: {},
      additionalProperties: true,
      description:
        "Important requirements explicitly supported by the available lead information.",
    },

    summary: {
      type: "string",
      description:
        "A concise and useful summary of the lead's intent, needs, and urgency.",
    },
  },

  required: ["intent", "score", "temperature", "requirements", "summary"],
};

const buildQualificationPrompt = ({ lead, businessContext = null }) => {
  return `
Analyze the following business lead and qualify it for a sales team.

Business context:
${businessContext || "General business lead management"}

Lead information:

Name:
${lead.name || "Unknown"}

Email:
${lead.email || "Not provided"}

Phone:
${lead.phone || "Not provided"}

Source:
${lead.source || "Unknown"}

Current status:
${lead.status || "new"}

Current temperature:
${lead.temperature || "cold"}

Current score:
${lead.score ?? 0}

Requirements:
${JSON.stringify(lead.requirements || {}, null, 2)}

Existing AI summary:
${lead.aiSummary || "None"}

Your task:

1. Identify the lead's primary business intent.
2. Extract important requirements explicitly supported by the available information.
3. Assign an intent/qualification score from 0 to 100.
4. Classify the lead as hot, warm, or cold.
5. Write a concise and useful sales-team summary.

Scoring guidance:

80-100:
Strong intent with clear need, urgency, budget, timeline, or other strong buying/action signals.

50-79:
Meaningful interest, but some important information is missing or uncertain.

0-49:
Weak, unclear, exploratory, or low-intent interest.

Important rules:

- Do not invent facts.
- Do not infer unsupported personal or business information.
- Keep requirements limited to information actually present in the lead data.
- If information is missing, leave it out rather than guessing.
- Preserve important quantities, locations, budgets, timelines, and property/product details exactly when supported.
- Keep the summary concise and professional.
- Ensure the summary uses natural spacing and grammar.
- Return only the requested structured result.
`;
};

const normalizeQualificationResult = (result) => {
  if (!result || typeof result !== "object") {
    throw new AppError("AI qualification returned an invalid result", 502);
  }

  const score = Number(result.score);

  if (!Number.isFinite(score) || score < 0 || score > 100) {
    throw new AppError("AI qualification returned an invalid score", 502);
  }

  const validTemperatures = ["hot", "warm", "cold"];

  if (!validTemperatures.includes(result.temperature)) {
    throw new AppError("AI qualification returned an invalid temperature", 502);
  }

  if (typeof result.intent !== "string" || !result.intent.trim()) {
    throw new AppError("AI qualification returned an invalid intent", 502);
  }

  if (typeof result.summary !== "string" || !result.summary.trim()) {
    throw new AppError("AI qualification returned an invalid summary", 502);
  }

  const requirements =
    result.requirements &&
    typeof result.requirements === "object" &&
    !Array.isArray(result.requirements)
      ? result.requirements
      : {};

  return {
    intent: result.intent.trim(),
    score: Math.round(score),
    temperature: result.temperature,
    requirements,
    summary: result.summary.trim(),
    provider: AI_PROVIDER,
    model: GEMINI_MODEL,
  };
};

export const qualifyLeadWithAI = async ({ lead, businessContext = null }) => {
  if (!lead) {
    throw new AppError("Lead data is required for AI qualification", 400);
  }

  try {
    const result = await generateStructuredAIResponse({
      prompt: buildQualificationPrompt({
        lead,
        businessContext,
      }),

      schema: qualificationSchema,

      systemInstruction:
        "You are LeadFlow's AI lead qualification engine. Analyze only the information provided. Return accurate structured sales qualification data without inventing facts.",
    });

    return normalizeQualificationResult(result);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    console.error("AI lead qualification failed:", error);

    throw new AppError("AI lead qualification failed", 502);
  }
};

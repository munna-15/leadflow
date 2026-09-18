import aiClient from "./ai.client.js";
import { GEMINI_MODEL } from "./ai.config.js";

const normalizePrompt = (prompt) => {
  if (typeof prompt !== "string" || !prompt.trim()) {
    throw new Error("AI prompt is required");
  }

  return prompt.trim();
};

const normalizeSchema = (schema) => {
  if (!schema || typeof schema !== "object") {
    throw new Error("AI response schema is required");
  }

  return schema;
};

export const generateStructuredAIResponse = async ({
  prompt,
  schema,
  systemInstruction,
  model = GEMINI_MODEL,
}) => {
  const normalizedPrompt = normalizePrompt(prompt);
  const normalizedSchema = normalizeSchema(schema);

  const interaction = await aiClient.interactions.create({
    model,
    input: normalizedPrompt,
    ...(systemInstruction
      ? {
          system_instruction: systemInstruction,
        }
      : {}),
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: normalizedSchema,
    },
    store: false,
  });

  if (!interaction?.output_text) {
    throw new Error("Gemini returned an empty response");
  }

  let parsedResponse;

  try {
    parsedResponse = JSON.parse(interaction.output_text);
  } catch (error) {
    console.error("Failed to parse Gemini JSON response:", error);

    throw new Error("Gemini returned invalid JSON");
  }

  return parsedResponse;
};

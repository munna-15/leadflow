import "dotenv/config";

import { generateStructuredAIResponse } from "./ai.service.js";

const test = async () => {
  try {
    const result = await generateStructuredAIResponse({
      prompt: `
You are testing the LeadFlow AI foundation.

Return a short response confirming that you understand this request.
Do not provide any extra information.
      `,
      schema: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
          },
          message: {
            type: "string",
          },
        },
        required: ["success", "message"],
      },
      systemInstruction: "You are the LeadFlow AI foundation test assistant.",
    });

    console.log("\nLeadFlow AI Foundation Test\n");
    console.log(JSON.stringify(result, null, 2));
    console.log("\nAI foundation test passed successfully.\n");
  } catch (error) {
    console.error("\nAI foundation test failed.\n");

    console.error(error?.message || error);
    process.exitCode = 1;
  }
};

test();

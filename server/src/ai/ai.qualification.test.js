import "dotenv/config";

import { qualifyLeadWithAI } from "../services/aiQualification.service.js";

const testLead = {
  name: "Rahim Ahmed",
  email: "rahim@example.com",
  phone: "+8801700000000",
  source: "website",
  status: "new",
  temperature: "cold",
  score: 0,
  requirements: {
    message:
      "I need a 3 bedroom apartment in Bashundhara. My budget is around 1 crore and I want to move next month.",
  },
  aiSummary: null,
};

const test = async () => {
  try {
    const result = await qualifyLeadWithAI({
      lead: testLead,
      businessContext:
        "Real estate business that receives residential property purchase leads.",
    });

    console.log("\nLeadFlow AI Qualification Test\n");
    console.log(JSON.stringify(result, null, 2));
    console.log("\nAI qualification test passed successfully.\n");
  } catch (error) {
    console.error("\nAI qualification test failed.\n");
    console.error(error?.message || error);
    process.exitCode = 1;
  }
};

test();

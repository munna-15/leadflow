import asyncHandler from "../utils/asyncHandler.js";

import { suggestNextAction } from "../services/aiNextAction.service.js";

export const suggestLeadNextAction = asyncHandler(async (req, res) => {
  const { leadId } = req.params;

  const recommendation = await suggestNextAction({
    leadId,
    businessId: req.user.businessId,
    businessContext: req.body?.businessContext || null,
  });

  res.status(200).json({
    success: true,
    message: "AI next-action recommendation generated successfully",
    data: {
      recommendation,
    },
  });
});

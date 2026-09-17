import asyncHandler from "../utils/asyncHandler.js";
import { getPipeline } from "../services/pipeline.service.js";

export const getPipelineOverview = asyncHandler(async (req, res) => {
  const pipeline = await getPipeline(req.user.businessId);

  res.status(200).json({
    success: true,
    message: "Pipeline fetched successfully",
    data: pipeline,
  });
});

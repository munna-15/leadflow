import asyncHandler from "../utils/asyncHandler.js";
import { submitGetStartedInquiry } from "../services/getStarted.service.js";

export const submitGetStartedController = asyncHandler(async (req, res) => {
  const result = await submitGetStartedInquiry(req.body);

  return res.status(201).json({
    success: true,
    message: "Your request has been received successfully.",
    data: result,
  });
});

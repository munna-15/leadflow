import asyncHandler from "../utils/asyncHandler.js";

import { getSettings, updateSettings } from "../services/settings.service.js";

export const get = asyncHandler(async (req, res) => {
  const settings = await getSettings(req.user.userId, req.user.businessId);

  res.status(200).json({
    success: true,
    message: "Settings retrieved successfully",
    data: {
      settings,
    },
  });
});

export const update = asyncHandler(async (req, res) => {
  const settings = await updateSettings(
    req.user.userId,
    req.user.businessId,
    req.body,
  );

  res.status(200).json({
    success: true,
    message: "Settings updated successfully",
    data: {
      settings,
    },
  });
});

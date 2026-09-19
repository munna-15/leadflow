
import asyncHandler from "../utils/asyncHandler.js";

import getPlatformSettings from "../services/platformSettings.service.js";

export const getPlatformSettingsController = asyncHandler(
  async (req, res) => {
    const settings = await getPlatformSettings(
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      data: settings,
    });
  },
);


import asyncHandler from "../utils/asyncHandler.js";

import {
  getActivities,
  getActivityById,
} from "../services/activity.service.js";

export const getAll = asyncHandler(async (req, res) => {
  const activities = await getActivities(req.user.businessId, {
    lead: req.query.lead,
    type: req.query.type,
  });

  res.status(200).json({
    success: true,
    message: "Activities fetched successfully",
    data: {
      activities,
    },
  });
});

export const getOne = asyncHandler(async (req, res) => {
  const activity = await getActivityById(req.params.id, req.user.businessId);

  res.status(200).json({
    success: true,
    message: "Activity fetched successfully",
    data: {
      activity,
    },
  });
});

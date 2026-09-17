import asyncHandler from "../utils/asyncHandler.js";

import {
  createFollowUp,
  getFollowUps,
  getFollowUpById,
  updateFollowUp,
  deleteFollowUp,
} from "../services/followUp.service.js";

export const create = asyncHandler(async (req, res) => {
  const followUp = await createFollowUp(
    req.body,
    req.user.businessId,
    req.user.userId,
  );

  res.status(201).json({
    success: true,
    message: "Follow-up created successfully",
    data: {
      followUp,
    },
  });
});

export const getAll = asyncHandler(async (req, res) => {
  const followUps = await getFollowUps(req.user.businessId, {
    status: req.query.status,
    type: req.query.type,
    lead: req.query.lead,
  });

  res.status(200).json({
    success: true,
    message: "Follow-ups fetched successfully",
    data: {
      followUps,
    },
  });
});

export const getOne = asyncHandler(async (req, res) => {
  const followUp = await getFollowUpById(req.params.id, req.user.businessId);

  res.status(200).json({
    success: true,
    message: "Follow-up fetched successfully",
    data: {
      followUp,
    },
  });
});

export const update = asyncHandler(async (req, res) => {
  const followUp = await updateFollowUp(
    req.params.id,
    req.body,
    req.user.businessId,
    req.user.userId,
  );

  res.status(200).json({
    success: true,
    message: "Follow-up updated successfully",
    data: {
      followUp,
    },
  });
});

export const remove = asyncHandler(async (req, res) => {
  await deleteFollowUp(req.params.id, req.user.businessId);

  res.status(200).json({
    success: true,
    message: "Follow-up deleted successfully",
  });
});

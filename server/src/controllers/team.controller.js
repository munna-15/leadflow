import asyncHandler from "../utils/asyncHandler.js";

import {
  getTeamMembers,
  inviteTeamMember,
  updateTeamMember,
  removeTeamMember,
} from "../services/team.service.js";

export const getMembers = asyncHandler(async (req, res) => {
  const members = await getTeamMembers(
    req.user.userId,
    req.user.businessId,
    req.user.role,
  );

  res.status(200).json({
    success: true,
    message: "Team members retrieved successfully",
    data: {
      members,
    },
  });
});

export const inviteMember = asyncHandler(async (req, res) => {
  const member = await inviteTeamMember({
    actorUserId: req.user.userId,
    actorRole: req.user.role,
    businessId: req.user.businessId,
    ...req.body,
  });

  res.status(201).json({
    success: true,
    message: "Team member added successfully",
    data: {
      member,
    },
  });
});

export const updateMember = asyncHandler(async (req, res) => {
  const member = await updateTeamMember({
    actorUserId: req.user.userId,
    actorRole: req.user.role,
    businessId: req.user.businessId,
    memberId: req.params.memberId,
    ...req.body,
  });

  res.status(200).json({
    success: true,
    message: "Team member updated successfully",
    data: {
      member,
    },
  });
});

export const removeMember = asyncHandler(async (req, res) => {
  const result = await removeTeamMember({
    actorUserId: req.user.userId,
    actorRole: req.user.role,
    businessId: req.user.businessId,
    memberId: req.params.memberId,
  });

  res.status(200).json({
    success: true,
    message: "Team member removed successfully",
    data: result,
  });
});

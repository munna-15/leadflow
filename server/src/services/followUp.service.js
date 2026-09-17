import mongoose from "mongoose";

import FollowUp from "../models/followUp.model.js";
import Lead from "../models/lead.model.js";
import AppError from "../utils/AppError.js";

import { createActivity } from "./activity.service.js";

const CREATEABLE_FIELDS = ["lead", "type", "scheduledAt", "notes"];

const UPDATABLE_FIELDS = ["type", "scheduledAt", "status", "notes"];

const pickAllowedFields = (data = {}, allowedFields) => {
  return allowedFields.reduce((result, field) => {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      result[field] = data[field];
    }

    return result;
  }, {});
};

const validateObjectId = (value, fieldName) => {
  if (!mongoose.isValidObjectId(value)) {
    throw new AppError(`Invalid ${fieldName}`, 400);
  }
};

const validateLeadOwnership = async (leadId, businessId) => {
  validateObjectId(leadId, "lead ID");

  const lead = await Lead.findOne({
    _id: leadId,
    businessId,
  }).select("_id name");

  if (!lead) {
    throw new AppError("Lead does not belong to this business", 400);
  }

  return lead;
};

const normalizeDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new AppError("Invalid scheduled date", 400);
  }

  return date;
};

const recordActivity = async ({
  businessId,
  leadId,
  actorId,
  type,
  title,
  description,
  metadata = {},
}) => {
  try {
    await createActivity({
      businessId,
      leadId,
      actorId,
      type,
      title,
      description,
      metadata,
    });
  } catch (error) {
    console.error(
      `Failed to record activity "${type}" for lead ${leadId}:`,
      error,
    );
  }
};

export const createFollowUp = async (data, businessId, actorId = null) => {
  const followUpData = pickAllowedFields(data, CREATEABLE_FIELDS);

  const lead = await validateLeadOwnership(followUpData.lead, businessId);

  followUpData.scheduledAt = normalizeDate(followUpData.scheduledAt);

  const followUp = await FollowUp.create({
    ...followUpData,
    businessId,
  });

  await recordActivity({
    businessId,
    leadId: lead._id,
    actorId,
    type: "follow_up_scheduled",
    title: "Follow-up scheduled",
    description: `${getChannelLabel(followUp.type)} follow-up scheduled for ${lead.name}.`,
    metadata: {
      followUpId: followUp._id,
      followUpType: followUp.type,
      scheduledAt: followUp.scheduledAt,
    },
  });

  return FollowUp.findById(followUp._id).populate(
    "lead",
    "name email phone status temperature score",
  );
};

export const getFollowUps = async (businessId, filters = {}) => {
  const query = {
    businessId,
  };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.lead) {
    validateObjectId(filters.lead, "lead ID");

    query.lead = filters.lead;
  }

  const followUps = await FollowUp.find(query)
    .populate("lead", "name email phone status temperature score")
    .sort({
      scheduledAt: 1,
    });

  return followUps;
};

export const getFollowUpById = async (followUpId, businessId) => {
  validateObjectId(followUpId, "follow-up ID");

  const followUp = await FollowUp.findOne({
    _id: followUpId,
    businessId,
  }).populate("lead", "name email phone status temperature score");

  if (!followUp) {
    throw new AppError("Follow-up not found", 404);
  }

  return followUp;
};

export const updateFollowUp = async (
  followUpId,
  data,
  businessId,
  actorId = null,
) => {
  validateObjectId(followUpId, "follow-up ID");

  const followUp = await FollowUp.findOne({
    _id: followUpId,
    businessId,
  });

  if (!followUp) {
    throw new AppError("Follow-up not found", 404);
  }

  const updateData = pickAllowedFields(data, UPDATABLE_FIELDS);

  const previousStatus = followUp.status;

  const previousScheduledAt = followUp.scheduledAt
    ? new Date(followUp.scheduledAt).getTime()
    : null;

  const previousType = followUp.type;

  if (Object.prototype.hasOwnProperty.call(updateData, "scheduledAt")) {
    updateData.scheduledAt = normalizeDate(updateData.scheduledAt);
  }

  if (Object.prototype.hasOwnProperty.call(updateData, "status")) {
    if (updateData.status === "completed") {
      updateData.completedAt = new Date();
    }

    if (updateData.status !== "completed") {
      updateData.completedAt = null;
    }
  }

  Object.assign(followUp, updateData);

  await followUp.save();

  const lead = await Lead.findOne({
    _id: followUp.lead,
    businessId,
  }).select("_id name");

  if (!lead) {
    throw new AppError("Lead does not belong to this business", 400);
  }

  const currentScheduledAt = followUp.scheduledAt
    ? new Date(followUp.scheduledAt).getTime()
    : null;

  const scheduledAtChanged =
    Object.prototype.hasOwnProperty.call(updateData, "scheduledAt") &&
    previousScheduledAt !== currentScheduledAt;

  const typeChanged =
    Object.prototype.hasOwnProperty.call(updateData, "type") &&
    previousType !== followUp.type;

  const statusChanged =
    Object.prototype.hasOwnProperty.call(updateData, "status") &&
    previousStatus !== followUp.status;

  if (statusChanged && followUp.status === "completed") {
    await recordActivity({
      businessId,
      leadId: lead._id,
      actorId,
      type: "follow_up_completed",
      title: "Follow-up completed",
      description: `${lead.name}'s ${getChannelLabel(followUp.type)} follow-up was completed.`,
      metadata: {
        followUpId: followUp._id,
        followUpType: followUp.type,
        previousStatus,
        completedAt: followUp.completedAt,
      },
    });
  } else if (statusChanged && followUp.status === "cancelled") {
    await recordActivity({
      businessId,
      leadId: lead._id,
      actorId,
      type: "follow_up_cancelled",
      title: "Follow-up cancelled",
      description: `${lead.name}'s scheduled ${getChannelLabel(followUp.type)} follow-up was cancelled.`,
      metadata: {
        followUpId: followUp._id,
        followUpType: followUp.type,
        previousStatus,
      },
    });
  } else if (scheduledAtChanged) {
    await recordActivity({
      businessId,
      leadId: lead._id,
      actorId,
      type: "follow_up_rescheduled",
      title: "Follow-up rescheduled",
      description: `${lead.name}'s ${getChannelLabel(followUp.type)} follow-up was rescheduled.`,
      metadata: {
        followUpId: followUp._id,
        followUpType: followUp.type,
        previousScheduledAt: new Date(previousScheduledAt),
        scheduledAt: followUp.scheduledAt,
      },
    });
  } else if (typeChanged) {
    await recordActivity({
      businessId,
      leadId: lead._id,
      actorId,
      type: "follow_up_rescheduled",
      title: "Follow-up updated",
      description: `${lead.name}'s follow-up channel was changed from ${getChannelLabel(previousType)} to ${getChannelLabel(followUp.type)}.`,
      metadata: {
        followUpId: followUp._id,
        previousType,
        followUpType: followUp.type,
      },
    });
  }

  return FollowUp.findById(followUp._id).populate(
    "lead",
    "name email phone status temperature score",
  );
};

export const deleteFollowUp = async (followUpId, businessId) => {
  validateObjectId(followUpId, "follow-up ID");

  const followUp = await FollowUp.findOneAndDelete({
    _id: followUpId,
    businessId,
  });

  if (!followUp) {
    throw new AppError("Follow-up not found", 404);
  }

  return followUp;
};

const getChannelLabel = (type) => {
  switch (type) {
    case "call":
      return "Call";

    case "message":
      return "Message";

    case "email":
      return "Email";

    case "meeting":
      return "Meeting";

    default:
      return "Follow-up";
  }
};

import mongoose from "mongoose";

import Activity from "../models/activity.model.js";
import Lead from "../models/lead.model.js";
import AppError from "../utils/AppError.js";

const ACTIVITY_TYPES = [
  "lead_created",
  "lead_assigned",
  "lead_updated",
  "status_changed",
  "temperature_changed",
  "follow_up_scheduled",
  "follow_up_rescheduled",
  "follow_up_completed",
  "follow_up_cancelled",
];

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
  }).select("_id");

  if (!lead) {
    throw new AppError("Lead does not belong to this business", 400);
  }

  return lead;
};

export const createActivity = async ({
  businessId,
  leadId,
  actorId = null,
  type,
  title,
  description,
  metadata = {},
}) => {
  if (!businessId) {
    throw new AppError("Business ID is required", 400);
  }

  validateObjectId(businessId, "business ID");

  await validateLeadOwnership(leadId, businessId);

  if (!ACTIVITY_TYPES.includes(type)) {
    throw new AppError("Invalid activity type", 400);
  }

  if (actorId && !mongoose.isValidObjectId(actorId)) {
    throw new AppError("Invalid actor ID", 400);
  }

  const activity = await Activity.create({
    businessId,
    lead: leadId,
    actor: actorId,
    type,
    title,
    description,
    metadata,
  });

  return Activity.findById(activity._id)
    .populate("lead", "name email phone status temperature score")
    .populate("actor", "name email avatar role");
};

export const getActivities = async (businessId, filters = {}) => {
  const query = {
    businessId,
  };

  if (filters.lead) {
    validateObjectId(filters.lead, "lead ID");

    await validateLeadOwnership(filters.lead, businessId);

    query.lead = filters.lead;
  }

  if (filters.type) {
    if (!ACTIVITY_TYPES.includes(filters.type)) {
      throw new AppError("Invalid activity type", 400);
    }

    query.type = filters.type;
  }

  const activities = await Activity.find(query)
    .populate("lead", "name email phone status temperature score")
    .populate("actor", "name email avatar role")
    .sort({
      createdAt: -1,
    });

  return activities;
};

export const getActivityById = async (activityId, businessId) => {
  validateObjectId(activityId, "activity ID");

  const activity = await Activity.findOne({
    _id: activityId,
    businessId,
  })
    .populate("lead", "name email phone status temperature score")
    .populate("actor", "name email avatar role");

  if (!activity) {
    throw new AppError("Activity not found", 404);
  }

  return activity;
};

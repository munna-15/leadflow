import mongoose from "mongoose";

import Lead from "../models/lead.model.js";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";

const buildLeadQuery = (businessId, filters = {}) => {
  const query = {
    businessId,
  };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.temperature) {
    query.temperature = filters.temperature;
  }

  if (filters.assignedTo) {
    query.assignedTo = filters.assignedTo;
  }

  if (filters.search) {
    const search = filters.search.trim();

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }
  }

  return query;
};

const validateAssignedUser = async (assignedTo, businessId) => {
  if (!assignedTo) {
    return null;
  }

  if (!mongoose.isValidObjectId(assignedTo)) {
    throw new AppError("Invalid assigned user ID", 400);
  }

  const user = await User.findOne({
    _id: assignedTo,
    businessId,
    isActive: true,
  }).select("_id");

  if (!user) {
    throw new AppError("Assigned user does not belong to this business", 400);
  }

  return user._id;
};

export const createLead = async (data, businessId) => {
  const assignedTo = await validateAssignedUser(data.assignedTo, businessId);

  const lead = await Lead.create({
    ...data,
    businessId,
    assignedTo,
  });

  return lead;
};

export const getLeads = async (businessId, filters = {}) => {
  const query = buildLeadQuery(businessId, filters);

  const leads = await Lead.find(query)
    .populate("assignedTo", "name email avatar role")
    .sort({ createdAt: -1 });

  return leads;
};

export const getLeadById = async (leadId, businessId) => {
  if (!mongoose.isValidObjectId(leadId)) {
    throw new AppError("Invalid lead ID", 400);
  }

  const lead = await Lead.findOne({
    _id: leadId,
    businessId,
  }).populate("assignedTo", "name email avatar role");

  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  return lead;
};

export const updateLead = async (leadId, data, businessId) => {
  if (!mongoose.isValidObjectId(leadId)) {
    throw new AppError("Invalid lead ID", 400);
  }

  const lead = await Lead.findOne({
    _id: leadId,
    businessId,
  });

  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  if (Object.prototype.hasOwnProperty.call(data, "assignedTo")) {
    data.assignedTo = await validateAssignedUser(data.assignedTo, businessId);
  }

  Object.assign(lead, data);

  await lead.save();

  return lead;
};

export const deleteLead = async (leadId, businessId) => {
  if (!mongoose.isValidObjectId(leadId)) {
    throw new AppError("Invalid lead ID", 400);
  }

  const lead = await Lead.findOneAndDelete({
    _id: leadId,
    businessId,
  });

  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  return lead;
};

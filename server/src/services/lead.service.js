import mongoose from "mongoose";

import Lead from "../models/lead.model.js";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";

const CREATEABLE_FIELDS = [
  "name",
  "email",
  "phone",
  "source",
  "status",
  "temperature",
  "score",
  "requirements",
  "aiSummary",
  "assignedTo",
  "nextFollowUpAt",
];

const UPDATABLE_FIELDS = [
  "name",
  "email",
  "phone",
  "source",
  "status",
  "temperature",
  "score",
  "requirements",
  "aiSummary",
  "assignedTo",
  "nextFollowUpAt",
];

const pickAllowedFields = (data = {}, allowedFields) => {
  return allowedFields.reduce((result, field) => {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      result[field] = data[field];
    }

    return result;
  }, {});
};

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

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
    if (!mongoose.isValidObjectId(filters.assignedTo)) {
      throw new AppError("Invalid assigned user ID", 400);
    }

    query.assignedTo = filters.assignedTo;
  }

  if (filters.search) {
    const search = filters.search.trim();

    if (search) {
      const safeSearch = escapeRegex(search);

      query.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { email: { $regex: safeSearch, $options: "i" } },
        { phone: { $regex: safeSearch, $options: "i" } },
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

const findExistingLead = async (leadData, businessId) => {
  const conditions = [];

  if (leadData.email) {
    conditions.push({
      email: leadData.email.toLowerCase(),
    });
  }

  if (leadData.phone) {
    conditions.push({
      phone: leadData.phone,
    });
  }

  if (!conditions.length) {
    return null;
  }

  return Lead.findOne({
    businessId,
    $or: conditions,
  });
};

export const createLead = async (data, businessId) => {
  const leadData = pickAllowedFields(data, CREATEABLE_FIELDS);

  if (leadData.email) {
    leadData.email = leadData.email.toLowerCase();
  }

  if (Object.prototype.hasOwnProperty.call(leadData, "assignedTo")) {
    leadData.assignedTo = await validateAssignedUser(
      leadData.assignedTo,
      businessId,
    );
  }

  const existingLead = await findExistingLead(leadData, businessId);

  if (existingLead) {
    throw new AppError("A lead with this email or phone already exists", 409);
  }

  const lead = await Lead.create({
    ...leadData,
    businessId,
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

  const updateData = pickAllowedFields(data, UPDATABLE_FIELDS);

  if (Object.prototype.hasOwnProperty.call(updateData, "assignedTo")) {
    updateData.assignedTo = await validateAssignedUser(
      updateData.assignedTo,
      businessId,
    );
  }

  Object.assign(lead, updateData);

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

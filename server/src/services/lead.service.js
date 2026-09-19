import mongoose from "mongoose";

import Lead from "../models/lead.model.js";
import User from "../models/user.model.js";

import AppError from "../utils/AppError.js";

import { createActivity } from "./activity.service.js";
import { createNotification } from "./notification.service.js";
import { qualifyLeadWithAI as runAIQualification } from "./aiQualification.service.js";

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
        {
          name: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          email: {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: safeSearch,
            $options: "i",
          },
        },
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
  }).select("_id name");

  if (!user) {
    throw new AppError("Assigned user does not belong to this business", 400);
  }

  return user;
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

const recordNotification = async ({
  businessId,
  recipientId,
  type,
  title,
  description,
  entity,
  action,
}) => {
  if (!recipientId) {
    return;
  }

  try {
    await createNotification({
      businessId,
      recipientId,
      type,
      title,
      description,
      entity,
      action,
    });
  } catch (error) {
    console.error(
      `Failed to create notification "${type}" for recipient ${recipientId}:`,
      error,
    );
  }
};

const findBusinessOwnerId = async (businessId) => {
  const owner = await User.findOne({
    businessId,
    role: "owner",
    isActive: true,
  }).select("_id");

  return owner?._id ?? null;
};

const getLeadAction = (label, href) => ({
  label,
  href,
});

export const createLead = async (data, businessId, actorId = null) => {
  const leadData = pickAllowedFields(data, CREATEABLE_FIELDS);

  if (leadData.email) {
    leadData.email = leadData.email.toLowerCase();
  }

  let assignedUser = null;

  if (Object.prototype.hasOwnProperty.call(leadData, "assignedTo")) {
    assignedUser = await validateAssignedUser(leadData.assignedTo, businessId);

    leadData.assignedTo = assignedUser?._id ?? null;
  }

  const existingLead = await findExistingLead(leadData, businessId);

  if (existingLead) {
    throw new AppError("A lead with this email or phone already exists", 409);
  }

  const lead = await Lead.create({
    ...leadData,
    businessId,
  });

  await recordActivity({
    businessId,
    leadId: lead._id,
    actorId,
    type: "lead_created",
    title: "Lead created",
    description: `${lead.name} was added to your lead pipeline.`,
    metadata: {
      source: lead.source,
      status: lead.status,
      temperature: lead.temperature,
    },
  });

  if (assignedUser) {
    await recordActivity({
      businessId,
      leadId: lead._id,
      actorId,
      type: "lead_assigned",
      title: "Lead assigned",
      description: `${lead.name} was assigned to ${assignedUser.name}.`,
      metadata: {
        assignedTo: assignedUser._id,
      },
    });
  }

  let notificationRecipientId = assignedUser?._id ?? actorId;

  if (!notificationRecipientId) {
    notificationRecipientId = await findBusinessOwnerId(businessId);
  }

  await recordNotification({
    businessId,
    recipientId: notificationRecipientId,
    type: "assigned",
    title: assignedUser
      ? `New lead assigned to ${assignedUser.name}`
      : "New lead captured",
    description: assignedUser
      ? `${lead.name} has been added to your sales queue and is ready for qualification.`
      : `${lead.name} was added to the lead pipeline and is waiting for follow-up.`,
    entity: {
      type: "lead",
      id: lead._id,
    },
    action: getLeadAction("View lead", `/dashboard/leads/${lead._id}`),
  });

  return lead;
};

export const getLeads = async (businessId, filters = {}) => {
  const query = buildLeadQuery(businessId, filters);

  const leads = await Lead.find(query)
    .populate("assignedTo", "name email avatar role")
    .sort({
      createdAt: -1,
    });

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

export const updateLead = async (leadId, data, businessId, actorId = null) => {
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

  const previousStatus = lead.status;
  const previousTemperature = lead.temperature;
  const previousAssignedTo = lead.assignedTo
    ? lead.assignedTo.toString()
    : null;

  let assignedUser = null;

  if (Object.prototype.hasOwnProperty.call(updateData, "assignedTo")) {
    assignedUser = await validateAssignedUser(
      updateData.assignedTo,
      businessId,
    );

    updateData.assignedTo = assignedUser?._id ?? null;
  }

  if (updateData.email) {
    updateData.email = updateData.email.toLowerCase();
  }

  Object.assign(lead, updateData);

  await lead.save();

  const currentAssignedTo = lead.assignedTo ? lead.assignedTo.toString() : null;

  if (
    Object.prototype.hasOwnProperty.call(updateData, "status") &&
    previousStatus !== lead.status
  ) {
    await recordActivity({
      businessId,
      leadId: lead._id,
      actorId,
      type: "status_changed",
      title: "Lead status changed",
      description: `${lead.name} moved from ${previousStatus} to ${lead.status}.`,
      metadata: {
        from: previousStatus,
        to: lead.status,
      },
    });
  }

  if (
    Object.prototype.hasOwnProperty.call(updateData, "temperature") &&
    previousTemperature !== lead.temperature
  ) {
    await recordActivity({
      businessId,
      leadId: lead._id,
      actorId,
      type: "temperature_changed",
      title: "Lead temperature changed",
      description: `${lead.name} changed from ${previousTemperature} to ${lead.temperature}.`,
      metadata: {
        from: previousTemperature,
        to: lead.temperature,
      },
    });
  }

  if (
    Object.prototype.hasOwnProperty.call(updateData, "assignedTo") &&
    previousAssignedTo !== currentAssignedTo
  ) {
    if (assignedUser) {
      await recordActivity({
        businessId,
        leadId: lead._id,
        actorId,
        type: "lead_assigned",
        title: "Lead assigned",
        description: `${lead.name} was assigned to ${assignedUser.name}.`,
        metadata: {
          previousAssignee: previousAssignedTo,
          assignedTo: assignedUser._id,
        },
      });

      await recordNotification({
        businessId,
        recipientId: assignedUser._id,
        type: "assigned",
        title: "New lead assigned to you",
        description: `${lead.name} has been assigned to your sales queue and is waiting for your attention.`,
        entity: {
          type: "lead",
          id: lead._id,
        },
        action: getLeadAction("View lead", `/dashboard/leads/${lead._id}`),
      });
    } else {
      await recordActivity({
        businessId,
        leadId: lead._id,
        actorId,
        type: "lead_assigned",
        title: "Lead unassigned",
        description: `${lead.name} was removed from the assigned sales queue.`,
        metadata: {
          previousAssignee: previousAssignedTo,
          assignedTo: null,
        },
      });
    }
  }

  const hasTrackedFieldChange =
    (Object.prototype.hasOwnProperty.call(updateData, "status") &&
      previousStatus !== lead.status) ||
    (Object.prototype.hasOwnProperty.call(updateData, "temperature") &&
      previousTemperature !== lead.temperature) ||
    (Object.prototype.hasOwnProperty.call(updateData, "assignedTo") &&
      previousAssignedTo !== currentAssignedTo);

  if (!hasTrackedFieldChange && Object.keys(updateData).length > 0) {
    await recordActivity({
      businessId,
      leadId: lead._id,
      actorId,
      type: "lead_updated",
      title: "Lead updated",
      description: `${lead.name}'s lead information was updated.`,
      metadata: {
        fields: Object.keys(updateData),
      },
    });
  }

  return Lead.findById(lead._id).populate(
    "assignedTo",
    "name email avatar role",
  );
};

export const qualifyLeadWithAI = async (
  leadId,
  businessId,
  actorId = null,
  businessContext = null,
) => {
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

  const qualification = await runAIQualification({
    lead,
    businessContext,
  });

  lead.score = qualification.score;
  lead.temperature = qualification.temperature;
  lead.requirements = qualification.requirements;
  lead.aiIntent = qualification.intent;
  lead.aiSummary = qualification.summary;
  lead.aiQualifiedAt = new Date();
  lead.aiProvider = qualification.provider;
  lead.aiModel = qualification.model;

  await lead.save();

  await recordActivity({
    businessId,
    leadId: lead._id,
    actorId,
    type: "lead_updated",
    title: "Lead qualified by AI",
    description: `${lead.name} was analyzed by AI with a ${lead.score}% qualification score and ${lead.temperature} temperature.`,
    metadata: {
      aiIntent: lead.aiIntent,
      score: lead.score,
      temperature: lead.temperature,
      provider: lead.aiProvider,
      model: lead.aiModel,
      aiQualifiedAt: lead.aiQualifiedAt,
    },
  });

  const notificationRecipientId =
    actorId ?? lead.assignedTo ?? (await findBusinessOwnerId(businessId));

  await recordNotification({
    businessId,
    recipientId: notificationRecipientId,
    type: "system",
    title: "AI qualification completed",
    description: `${lead.name} received a ${lead.score}% qualification score and ${lead.temperature} temperature.`,
    entity: {
      type: "lead",
      id: lead._id,
    },
    action: getLeadAction("Review lead", `/dashboard/leads/${lead._id}`),
  });

  if (lead.temperature === "hot" && lead.score >= 80) {
    await recordNotification({
      businessId,
      recipientId: notificationRecipientId,
      type: "hot-lead",
      title: `${lead.name} is a high-intent lead`,
      description: `${lead.name} has a ${lead.score}% lead score and should be prioritized for follow-up.`,
      entity: {
        type: "lead",
        id: lead._id,
      },
      action: getLeadAction("View lead", `/dashboard/leads/${lead._id}`),
    });
  }

  return Lead.findById(lead._id).populate(
    "assignedTo",
    "name email avatar role",
  );
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

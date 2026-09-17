import mongoose from "mongoose";

import Lead from "../models/lead.model.js";
import AppError from "../utils/AppError.js";

const PIPELINE_STAGES = [
  {
    key: "new",
    label: "New",
    description: "Fresh opportunities",
  },
  {
    key: "qualified",
    label: "Qualified",
    description: "Ready for contact",
  },
  {
    key: "contacted",
    label: "Contacted",
    description: "Active conversations",
  },
  {
    key: "meeting",
    label: "Meeting",
    description: "Appointments in progress",
  },
  {
    key: "negotiation",
    label: "Negotiation",
    description: "Decision stage",
  },
];

const OUTCOME_STAGES = [
  {
    key: "won",
    label: "Won",
    description: "Successful opportunities",
  },
  {
    key: "lost",
    label: "Lost",
    description: "Closed opportunities",
  },
];

const ALL_STAGES = [...PIPELINE_STAGES, ...OUTCOME_STAGES];

const ACTIVE_STATUS_KEYS = new Set(PIPELINE_STAGES.map((stage) => stage.key));

const getBusinessObjectId = (businessId) => {
  if (!mongoose.isValidObjectId(businessId)) {
    throw new AppError("Invalid business ID", 400);
  }

  return new mongoose.Types.ObjectId(businessId);
};

const formatRequirementValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : null;
  }

  if (typeof value === "object") {
    return null;
  }

  return String(value);
};

const formatPropertyType = (value) => {
  const formatted = formatRequirementValue(value);

  if (!formatted) {
    return null;
  }

  return formatted
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const buildLeadDetail = (lead) => {
  const requirements = lead.requirements || {};

  const propertyType = formatPropertyType(requirements.propertyType);

  const bedrooms = formatRequirementValue(requirements.bedrooms);

  const location = formatRequirementValue(requirements.location);

  const intent = formatRequirementValue(requirements.intent);

  const parts = [];

  if (bedrooms) {
    parts.push(
      `${bedrooms} ${Number(bedrooms) === 1 ? "bedroom" : "bedrooms"}`,
    );
  }

  if (propertyType) {
    parts.push(propertyType);
  }

  if (location) {
    parts.push(location);
  }

  if (parts.length > 0) {
    return parts.join(" · ");
  }

  if (intent) {
    return intent
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());
  }

  if (lead.source) {
    return `Lead captured from ${lead.source}`;
  }

  return "Lead opportunity";
};

const mapLeadForPipeline = (lead) => {
  return {
    id: lead._id.toString(),
    name: lead.name,
    detail: buildLeadDetail(lead),
    score: lead.score,
    temperature: lead.temperature,
    status: lead.status,
    source: lead.source,
    email: lead.email,
    phone: lead.phone,
    nextFollowUpAt: lead.nextFollowUpAt,
    assignedTo: lead.assignedTo
      ? {
          id: lead.assignedTo._id.toString(),
          name: lead.assignedTo.name,
          email: lead.assignedTo.email,
          avatar: lead.assignedTo.avatar,
          role: lead.assignedTo.role,
        }
      : null,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  };
};

const groupLeadsByStatus = (leads) => {
  const grouped = Object.fromEntries(
    ALL_STAGES.map((stage) => [stage.key, []]),
  );

  for (const lead of leads) {
    if (grouped[lead.status]) {
      grouped[lead.status].push(mapLeadForPipeline(lead));
    }
  }

  return grouped;
};

const buildSummary = (leads, groupedLeads) => {
  const summary = {
    total: leads.length,
    active: 0,
    new: 0,
    qualified: 0,
    contacted: 0,
    meeting: 0,
    negotiation: 0,
    won: 0,
    lost: 0,
  };

  for (const stage of ALL_STAGES) {
    summary[stage.key] = groupedLeads[stage.key].length;
  }

  summary.active = PIPELINE_STAGES.reduce(
    (total, stage) => total + groupedLeads[stage.key].length,
    0,
  );

  return summary;
};

const buildSignals = (leads) => {
  const activeLeads = leads.filter((lead) =>
    ACTIVE_STATUS_KEYS.has(lead.status),
  );

  const hotLeads = activeLeads.filter((lead) => lead.temperature === "hot");

  const highScoreLeads = activeLeads.filter((lead) => lead.score >= 80);

  const overdueFollowUps = activeLeads.filter((lead) => {
    if (!lead.nextFollowUpAt) {
      return false;
    }

    return new Date(lead.nextFollowUpAt).getTime() < Date.now();
  });

  return {
    hotLeads: {
      count: hotLeads.length,
      leads: hotLeads
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(mapLeadForPipeline),
    },

    highScoreLeads: {
      count: highScoreLeads.length,
      leads: highScoreLeads
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(mapLeadForPipeline),
    },

    attentionNeeded: {
      count: overdueFollowUps.length,
      leads: overdueFollowUps
        .sort(
          (a, b) =>
            new Date(a.nextFollowUpAt).getTime() -
            new Date(b.nextFollowUpAt).getTime(),
        )
        .slice(0, 5)
        .map(mapLeadForPipeline),
    },
  };
};

export const getPipeline = async (businessId) => {
  const businessObjectId = getBusinessObjectId(businessId);

  const leads = await Lead.find({
    businessId: businessObjectId,
  })
    .populate("assignedTo", "name email avatar role")
    .sort({
      updatedAt: -1,
    })
    .lean();

  const groupedLeads = groupLeadsByStatus(leads);

  const stages = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    count: groupedLeads[stage.key].length,
    leads: groupedLeads[stage.key],
  }));

  const outcomes = OUTCOME_STAGES.map((stage) => ({
    ...stage,
    count: groupedLeads[stage.key].length,
    leads: groupedLeads[stage.key],
  }));

  return {
    summary: buildSummary(leads, groupedLeads),

    stages,

    outcomes,

    signals: buildSignals(leads),
  };
};

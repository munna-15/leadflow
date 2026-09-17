import mongoose from "mongoose";

import Lead from "../models/lead.model.js";
import FollowUp from "../models/followUp.model.js";
import Activity from "../models/activity.model.js";

const PIPELINE_STAGES = [
  {
    id: "new",
    label: "New",
  },
  {
    id: "qualified",
    label: "Qualified",
  },
  {
    id: "contacted",
    label: "Contacted",
  },
  {
    id: "meeting",
    label: "Meeting",
  },
  {
    id: "negotiation",
    label: "Negotiation",
  },
];

const normalizeBusinessId = (businessId) => {
  if (!businessId) {
    throw new Error("Business ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    throw new Error("Invalid business ID");
  }

  return new mongoose.Types.ObjectId(businessId);
};

const getStartOfToday = () => {
  const date = new Date();

  date.setHours(0, 0, 0, 0);

  return date;
};

const getEndOfToday = () => {
  const date = new Date();

  date.setHours(23, 59, 59, 999);

  return date;
};

const getAttentionItems = async (businessId) => {
  const now = new Date();

  const startOfToday = getStartOfToday();
  const endOfToday = getEndOfToday();

  const [overdueFollowUps, highIntentLeads, upcomingFollowUps] =
    await Promise.all([
      FollowUp.find({
        businessId,
        status: "scheduled",
        scheduledAt: {
          $lt: now,
        },
      })
        .populate({
          path: "lead",
          select: "name email phone status temperature score nextFollowUpAt",
        })
        .sort({
          scheduledAt: 1,
        })
        .limit(5)
        .lean(),

      Lead.find({
        businessId,
        status: {
          $nin: ["won", "lost"],
        },
        score: {
          $gte: 80,
        },
      })
        .sort({
          score: -1,
          updatedAt: -1,
        })
        .limit(5)
        .lean(),

      FollowUp.find({
        businessId,
        status: "scheduled",
        scheduledAt: {
          $gte: startOfToday,
          $lte: new Date(endOfToday.getTime() + 24 * 60 * 60 * 1000),
        },
      })
        .populate({
          path: "lead",
          select: "name email phone status temperature score nextFollowUpAt",
        })
        .sort({
          scheduledAt: 1,
        })
        .limit(5)
        .lean(),
    ]);

  const items = [];
  const usedLeadIds = new Set();

  overdueFollowUps.forEach((followUp) => {
    if (!followUp.lead?._id) {
      return;
    }

    const leadId = followUp.lead._id.toString();

    if (usedLeadIds.has(leadId)) {
      return;
    }

    usedLeadIds.add(leadId);

    items.push({
      id: `overdue-${followUp._id}`,
      type: "overdue_follow_up",
      title: "Follow-up overdue",
      description: `${followUp.lead.name} is waiting for a follow-up.`,
      leadId,
      leadName: followUp.lead.name,
      score: followUp.lead.score,
      temperature: followUp.lead.temperature,
      scheduledAt: followUp.scheduledAt,
      priority: "high",
    });
  });

  highIntentLeads.forEach((lead) => {
    if (!lead._id) {
      return;
    }

    const leadId = lead._id.toString();

    if (usedLeadIds.has(leadId)) {
      return;
    }

    usedLeadIds.add(leadId);

    items.push({
      id: `intent-${lead._id}`,
      type: "high_intent",
      title: "High-intent lead",
      description: `${lead.name} has a ${lead.score}% lead score.`,
      leadId,
      leadName: lead.name,
      score: lead.score,
      temperature: lead.temperature,
      scheduledAt: lead.nextFollowUpAt,
      priority: "high",
    });
  });

  upcomingFollowUps.forEach((followUp) => {
    if (!followUp.lead?._id) {
      return;
    }

    const leadId = followUp.lead._id.toString();

    if (usedLeadIds.has(leadId)) {
      return;
    }

    usedLeadIds.add(leadId);

    items.push({
      id: `upcoming-${followUp._id}`,
      type: "upcoming_follow_up",
      title: "Upcoming follow-up",
      description: `A follow-up with ${followUp.lead.name} is coming up.`,
      leadId,
      leadName: followUp.lead.name,
      score: followUp.lead.score,
      temperature: followUp.lead.temperature,
      scheduledAt: followUp.scheduledAt,
      priority: "medium",
    });
  });

  return items.slice(0, 8);
};

export const getDashboardOverview = async (businessId) => {
  const normalizedBusinessId = normalizeBusinessId(businessId);

  const now = new Date();
  const endOfToday = getEndOfToday();

  const [
    activeLeads,
    highIntentLeads,
    followUpsDue,
    pipelineCounts,
    recentActivities,
    attentionItems,
  ] = await Promise.all([
    Lead.countDocuments({
      businessId: normalizedBusinessId,
      status: {
        $nin: ["won", "lost"],
      },
    }),

    Lead.countDocuments({
      businessId: normalizedBusinessId,
      status: {
        $nin: ["won", "lost"],
      },
      score: {
        $gte: 80,
      },
    }),

    FollowUp.countDocuments({
      businessId: normalizedBusinessId,
      status: "scheduled",
      scheduledAt: {
        $lte: endOfToday,
      },
    }),

    Lead.aggregate([
      {
        $match: {
          businessId: normalizedBusinessId,
        },
      },
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]),

    Activity.find({
      businessId: normalizedBusinessId,
    })
      .populate({
        path: "lead",
        select: "name email phone status temperature score",
      })
      .populate({
        path: "actor",
        select: "name email role avatar",
      })
      .sort({
        createdAt: -1,
      })
      .limit(6)
      .lean(),

    getAttentionItems(normalizedBusinessId),
  ]);

  const pipelineMap = pipelineCounts.reduce((accumulator, item) => {
    accumulator[item._id] = item.count;

    return accumulator;
  }, {});

  const stages = PIPELINE_STAGES.map((stage) => ({
    id: stage.id,
    label: stage.label,
    count: pipelineMap[stage.id] || 0,
  }));

  return {
    summary: {
      activeLeads,
      highIntentLeads,
      followUpsDue,
    },

    attentionItems,

    pipeline: {
      stages,
      won: pipelineMap.won || 0,
      lost: pipelineMap.lost || 0,
    },

    recentActivities,

    meta: {
      generatedAt: now,
    },
  };
};

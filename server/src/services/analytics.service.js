import mongoose from "mongoose";

import Lead from "../models/lead.model.js";
import FollowUp from "../models/followUp.model.js";
import Activity from "../models/activity.model.js";
import User from "../models/user.model.js";

const PIPELINE_STAGES = [
  { id: "new", label: "New" },
  { id: "qualified", label: "Qualified" },
  { id: "contacted", label: "Contacted" },
  { id: "meeting", label: "Meeting" },
  { id: "negotiation", label: "Negotiation" },
];

const normalizeBusinessId = (businessId) => {
  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    throw new Error("Invalid business ID");
  }

  return new mongoose.Types.ObjectId(businessId);
};

const normalizeSource = (source) => {
  if (!source) {
    return "unknown";
  }

  const normalized = source.trim().toLowerCase();

  const sourceMap = {
    website: "website",
    web: "website",
    "website form": "website",
    landing_page: "website",
    landingpage: "website",

    facebook: "facebook",
    fb: "facebook",
    messenger: "facebook",

    whatsapp: "whatsapp",
    "whatsapp business": "whatsapp",

    referral: "referral",
    referred: "referral",

    manual: "manual",
  };

  return sourceMap[normalized] || normalized;
};

const formatSourceLabel = (source) => {
  const labels = {
    website: "Website",
    facebook: "Facebook",
    whatsapp: "WhatsApp",
    referral: "Referral",
    manual: "Manual",
    unknown: "Unknown",
  };

  return (
    labels[source] ||
    source
      .split(/[_-]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
};

const buildDateRange = (range = "30d") => {
  const now = new Date();

  const daysMap = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
  };

  const days = daysMap[range] || 30;

  const start = new Date(now);
  start.setDate(start.getDate() - days);

  return {
    start,
    end: now,
    range: daysMap[range] ? range : "30d",
  };
};

const getOverview = async (businessId, dateFilter) => {
  const [totalLeads, qualified, meetings, won] = await Promise.all([
    Lead.countDocuments({
      businessId,
      ...dateFilter,
    }),

    Lead.countDocuments({
      businessId,
      status: "qualified",
      ...dateFilter,
    }),

    Lead.countDocuments({
      businessId,
      status: "meeting",
      ...dateFilter,
    }),

    Lead.countDocuments({
      businessId,
      status: "won",
      ...dateFilter,
    }),
  ]);

  const conversionRate =
    totalLeads > 0 ? Number(((won / totalLeads) * 100).toFixed(1)) : 0;

  return {
    totalLeads,
    qualified,
    meetings,
    won,
    conversionRate,
  };
};

const getPipeline = async (businessId, dateFilter) => {
  const stageCounts = await Lead.aggregate([
    {
      $match: {
        businessId,
        ...dateFilter,
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const countMap = new Map(
    stageCounts.map((stage) => [stage._id, stage.count]),
  );

  const stages = PIPELINE_STAGES.map((stage) => ({
    id: stage.id,
    label: stage.label,
    count: countMap.get(stage.id) || 0,
  }));

  return {
    stages,
    won: countMap.get("won") || 0,
    lost: countMap.get("lost") || 0,
  };
};

const getSources = async (businessId, dateFilter) => {
  const sourceData = await Lead.aggregate([
    {
      $match: {
        businessId,
        ...dateFilter,
      },
    },
    {
      $group: {
        _id: "$source",
        leads: { $sum: 1 },
        qualified: {
          $sum: {
            $cond: [{ $eq: ["$status", "qualified"] }, 1, 0],
          },
        },
      },
    },
    {
      $sort: {
        leads: -1,
      },
    },
  ]);

  const normalizedSources = sourceData.reduce((accumulator, source) => {
    const normalizedSource = normalizeSource(source._id);

    const existing = accumulator.get(normalizedSource);

    if (existing) {
      existing.leads += source.leads;
      existing.qualified += source.qualified;
    } else {
      accumulator.set(normalizedSource, {
        source: normalizedSource,
        leads: source.leads,
        qualified: source.qualified,
      });
    }

    return accumulator;
  }, new Map());

  const sources = Array.from(normalizedSources.values());

  const totalLeads = sources.reduce((total, source) => total + source.leads, 0);

  return sources
    .map((source) => ({
      source: source.source,
      name: formatSourceLabel(source.source),
      leads: source.leads,
      qualified: source.qualified,
      share:
        totalLeads > 0
          ? Number(((source.leads / totalLeads) * 100).toFixed(1))
          : 0,
      qualificationRate:
        source.leads > 0
          ? Number(((source.qualified / source.leads) * 100).toFixed(1))
          : 0,
    }))
    .sort((a, b) => b.leads - a.leads);
};

const getTeam = async (businessId, dateFilter) => {
  const users = await User.find({
    businessId,
    isActive: true,
  })
    .select("_id name email role avatar")
    .sort({ name: 1 })
    .lean();

  const team = await Promise.all(
    users.map(async (user) => {
      const userLeadFilter = {
        businessId,
        assignedTo: user._id,
        ...dateFilter,
      };

      const assignedLeadIds = await Lead.find(userLeadFilter).distinct("_id");

      const [assignedLeads, qualifiedLeads, wonLeads, followUps, activities] =
        await Promise.all([
          Lead.countDocuments(userLeadFilter),

          Lead.countDocuments({
            ...userLeadFilter,
            status: "qualified",
          }),

          Lead.countDocuments({
            ...userLeadFilter,
            status: "won",
          }),

          FollowUp.countDocuments({
            businessId,
            lead: {
              $in: assignedLeadIds,
            },
            ...dateFilter,
          }),

          Activity.countDocuments({
            businessId,
            actor: user._id,
            ...dateFilter,
          }),
        ]);

      return {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar || null,
        },
        assignedLeads,
        qualifiedLeads,
        wonLeads,
        followUps,
        activities,
      };
    }),
  );

  return team;
};

const getInsights = async (businessId, dateFilter) => {
  const [highIntentLeads, overdueFollowUps, qualifiedWithoutFollowUp] =
    await Promise.all([
      Lead.find({
        businessId,
        score: { $gte: 80 },
        status: { $nin: ["won", "lost"] },
        ...dateFilter,
      })
        .select("_id name score temperature nextFollowUpAt")
        .sort({ score: -1 })
        .limit(10)
        .lean(),

      FollowUp.countDocuments({
        businessId,
        status: "scheduled",
        scheduledAt: { $lt: new Date() },
        ...dateFilter,
      }),

      Lead.countDocuments({
        businessId,
        status: "qualified",
        nextFollowUpAt: null,
        ...dateFilter,
      }),
    ]);

  const insights = [];

  if (qualifiedWithoutFollowUp > 0) {
    insights.push({
      type: "attention",
      title: "Qualified leads need follow-up",
      description: `${qualifiedWithoutFollowUp} qualified ${
        qualifiedWithoutFollowUp === 1 ? "lead has" : "leads have"
      } no next follow-up scheduled.`,
      metric: qualifiedWithoutFollowUp,
      metricLabel: "qualified leads",
    });
  }

  if (overdueFollowUps > 0) {
    insights.push({
      type: "attention",
      title: "Follow-ups are overdue",
      description: `${overdueFollowUps} scheduled ${
        overdueFollowUps === 1 ? "follow-up is" : "follow-ups are"
      } past their scheduled time.`,
      metric: overdueFollowUps,
      metricLabel: "overdue follow-ups",
    });
  }

  if (highIntentLeads.length > 0) {
    insights.push({
      type: "priority",
      title: "High-intent leads need attention",
      description: `${highIntentLeads.length} active ${
        highIntentLeads.length === 1 ? "lead has" : "leads have"
      } a score of 80 or higher.`,
      metric: highIntentLeads.length,
      metricLabel: "high-intent leads",
      leadIds: highIntentLeads.map((lead) => lead._id),
    });
  }

  return insights;
};

export const getAnalyticsOverview = async (businessId, range = "30d") => {
  const normalizedBusinessId = normalizeBusinessId(businessId);

  const { start, end, range: normalizedRange } = buildDateRange(range);

  const dateFilter = {
    createdAt: {
      $gte: start,
      $lte: end,
    },
  };

  const [overview, pipeline, sources, team, insights] = await Promise.all([
    getOverview(normalizedBusinessId, dateFilter),
    getPipeline(normalizedBusinessId, dateFilter),
    getSources(normalizedBusinessId, dateFilter),
    getTeam(normalizedBusinessId, dateFilter),
    getInsights(normalizedBusinessId, dateFilter),
  ]);

  return {
    overview,
    pipeline,
    sources,
    team,
    insights,
    meta: {
      range: normalizedRange,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      generatedAt: new Date().toISOString(),
    },
  };
};

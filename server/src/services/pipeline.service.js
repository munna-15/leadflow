import mongoose from "mongoose";

import Lead from "../models/lead.model.js";

const PIPELINE_STAGES = [
  {
    key: "new",
    label: "New",
  },
  {
    key: "qualified",
    label: "Qualified",
  },
  {
    key: "contacted",
    label: "Contacted",
  },
  {
    key: "meeting",
    label: "Meeting",
  },
  {
    key: "negotiation",
    label: "Negotiation",
  },
  {
    key: "won",
    label: "Won",
  },
  {
    key: "lost",
    label: "Lost",
  },
];

export const getPipeline = async (businessId) => {
  const [summaryResult, leads] = await Promise.all([
    Lead.aggregate([
      {
        $match: {
          businessId: new mongoose.Types.ObjectId(businessId),
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

    Lead.find({
      businessId,
    })
      .populate("assignedTo", "name email avatar role")
      .sort({
        updatedAt: -1,
      })
      .lean(),
  ]);

  const counts = Object.fromEntries(
    summaryResult.map((item) => [item._id, item.count]),
  );

  const stages = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    count: counts[stage.key] || 0,
    leads: leads.filter((lead) => lead.status === stage.key),
  }));

  return {
    summary: {
      total: leads.length,
      ...Object.fromEntries(
        PIPELINE_STAGES.map((stage) => [stage.key, counts[stage.key] || 0]),
      ),
    },
    stages,
  };
};

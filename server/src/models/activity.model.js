import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },

    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },

    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "lead_created",
        "lead_assigned",
        "lead_updated",
        "status_changed",
        "temperature_changed",
        "follow_up_scheduled",
        "follow_up_rescheduled",
        "follow_up_completed",
        "follow_up_cancelled",
      ],
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

activitySchema.index({
  businessId: 1,
  lead: 1,
  createdAt: -1,
});

activitySchema.index({
  businessId: 1,
  createdAt: -1,
});

activitySchema.index({
  businessId: 1,
  type: 1,
  createdAt: -1,
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;

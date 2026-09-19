import mongoose from "mongoose";

const followUpSchema = new mongoose.Schema(
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

    type: {
      type: String,
      enum: ["call", "message", "email", "meeting", "other"],
      required: true,
    },

    scheduledAt: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
      index: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    overdueNotificationSentAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

followUpSchema.index({
  businessId: 1,
  scheduledAt: 1,
});

followUpSchema.index({
  businessId: 1,
  status: 1,
});

followUpSchema.index({
  businessId: 1,
  lead: 1,
  scheduledAt: 1,
});

followUpSchema.index({
  status: 1,
  scheduledAt: 1,
  overdueNotificationSentAt: 1,
});

const FollowUp = mongoose.model("FollowUp", followUpSchema);

export default FollowUp;

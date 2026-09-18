import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },

    notifications: {
      inApp: {
        type: Boolean,
        default: true,
      },

      email: {
        type: Boolean,
        default: true,
      },

      browser: {
        type: Boolean,
        default: false,
      },

      teamActivity: {
        type: Boolean,
        default: true,
      },
    },

    ai: {
      automaticQualification: {
        type: Boolean,
        default: true,
      },

      leadSummary: {
        type: Boolean,
        default: true,
      },

      suggestedNextAction: {
        type: Boolean,
        default: true,
      },

      scoringMode: {
        type: String,
        enum: ["balanced", "intent", "engagement"],
        default: "balanced",
      },
    },
  },
  {
    timestamps: true,
  },
);

settingsSchema.index({ userId: 1, businessId: 1 }, { unique: true });

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;

import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
      minlength: 2,
      maxlength: 120,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },

    source: {
      type: String,
      trim: true,
      default: "manual",
      maxlength: 50,
    },

    status: {
      type: String,
      enum: [
        "new",
        "qualified",
        "contacted",
        "meeting",
        "negotiation",
        "won",
        "lost",
      ],
      default: "new",
      index: true,
    },

    temperature: {
      type: String,
      enum: ["hot", "warm", "cold"],
      default: "cold",
      index: true,
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    requirements: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    aiSummary: {
      type: String,
      trim: true,
      default: null,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    nextFollowUpAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

leadSchema.index({ businessId: 1, createdAt: -1 });
leadSchema.index({ businessId: 1, status: 1 });
leadSchema.index({ businessId: 1, temperature: 1 });

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;

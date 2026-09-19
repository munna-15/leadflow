import mongoose from "mongoose";

const getStartedInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    businessName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },

    businessType: {
      type: String,
      trim: true,
      default: null,
      maxlength: 120,
    },

    website: {
      type: String,
      trim: true,
      default: null,
      maxlength: 300,
    },

    teamSize: {
      type: String,
      trim: true,
      default: null,
      maxlength: 120,
    },

    leadVolume: {
      type: String,
      trim: true,
      default: null,
      maxlength: 120,
    },

    needs: {
      type: [String],
      default: [],
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    source: {
      type: String,
      enum: ["get_started"],
      default: "get_started",
      immutable: true,
    },

    status: {
      type: String,
      enum: ["new", "reviewed", "contacted", "archived"],
      default: "new",
    },

    emailDelivered: {
      type: Boolean,
      default: false,
    },

    emailId: {
      type: String,
      default: null,
    },

    emailError: {
      type: String,
      default: null,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  },
);

getStartedInquirySchema.index({
  status: 1,
  createdAt: -1,
});

getStartedInquirySchema.index({
  email: 1,
  createdAt: -1,
});

const GetStartedInquiry = mongoose.model(
  "GetStartedInquiry",
  getStartedInquirySchema,
);

export default GetStartedInquiry;

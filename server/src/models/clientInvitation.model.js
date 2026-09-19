import mongoose from "mongoose";



const clientInvitationSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 320,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    role: {
      type: String,
      enum: ["owner"],
      required: true,
      default: "owner",
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "revoked"],
      required: true,
      default: "pending",
      index: true,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },

    revokedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);



clientInvitationSchema.index({
  businessId: 1,
  userId: 1,
  status: 1,
  createdAt: -1,
});



clientInvitationSchema.index({
  email: 1,
  status: 1,
  createdAt: -1,
});


clientInvitationSchema.index({
  expiresAt: 1,
  status: 1,
});



const ClientInvitation = mongoose.model(
  "ClientInvitation",
  clientInvitationSchema,
);

export default ClientInvitation;

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },

    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "hot-lead",
        "overdue",
        "meeting",
        "assigned",
        "completed",
        "system",
      ],
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    entity: {
      type: {
        type: String,
        enum: ["lead", "follow-up", "meeting", "activity", "system"],
        default: null,
      },

      id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
    },

    action: {
      label: {
        type: String,
        trim: true,
        maxlength: 80,
        default: null,
      },

      href: {
        type: String,
        trim: true,
        maxlength: 500,
        default: null,
      },
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({
  businessId: 1,
  recipientId: 1,
  isRead: 1,
  createdAt: -1,
});

notificationSchema.index({
  businessId: 1,
  recipientId: 1,
  createdAt: -1,
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;

import FollowUp from "../models/followUp.model.js";
import User from "../models/user.model.js";

import { createNotification } from "./notification.service.js";

const DEFAULT_INTERVAL_MS = 60 * 1000;

let schedulerTimer = null;
let isRunning = false;

const getSchedulerInterval = () => {
  const value = Number(
    process.env.NOTIFICATION_SCHEDULER_INTERVAL_MS || DEFAULT_INTERVAL_MS,
  );

  if (!Number.isFinite(value) || value < 10000) {
    return DEFAULT_INTERVAL_MS;
  }

  return value;
};

const findBusinessOwnerId = async (businessId) => {
  const owner = await User.findOne({
    businessId,
    role: "owner",
    isActive: true,
  }).select("_id");

  return owner?._id ?? null;
};

const resolveRecipientId = async (businessId, assignedTo, ownerCache) => {
  if (assignedTo) {
    return assignedTo;
  }

  if (ownerCache.has(businessId)) {
    return ownerCache.get(businessId);
  }

  const ownerId = await findBusinessOwnerId(businessId);

  ownerCache.set(businessId, ownerId);

  return ownerId;
};

const processOverdueFollowUp = async (followUp, ownerCache) => {
  const claimedAt = new Date();

  const claimedFollowUp = await FollowUp.findOneAndUpdate(
    {
      _id: followUp._id,
      status: "scheduled",
      scheduledAt: {
        $lt: claimedAt,
      },
      overdueNotificationSentAt: null,
    },
    {
      $set: {
        overdueNotificationSentAt: claimedAt,
      },
    },
    {
      new: true,
    },
  )
    .populate("lead", "name assignedTo")
    .lean();

  if (!claimedFollowUp) {
    return false;
  }

  try {
    const lead = claimedFollowUp.lead;

    if (!lead) {
      throw new Error(`Lead not found for follow-up ${claimedFollowUp._id}`);
    }

    const recipientId = await resolveRecipientId(
      claimedFollowUp.businessId,
      lead.assignedTo,
      ownerCache,
    );

    if (!recipientId) {
      throw new Error(
        `No notification recipient found for business ${claimedFollowUp.businessId}`,
      );
    }

    const channel =
      claimedFollowUp.type === "meeting" ? "meeting" : "follow-up";

    const title =
      channel === "meeting"
        ? `Meeting overdue for ${lead.name}`
        : `Follow-up is overdue for ${lead.name}`;

    const description =
      channel === "meeting"
        ? `The scheduled meeting with ${lead.name} has passed without being completed. Review the lead and update the next action.`
        : `${lead.name}'s ${claimedFollowUp.type} follow-up is overdue and requires attention.`;

    await createNotification({
      businessId: claimedFollowUp.businessId,
      recipientId,
      type: "overdue",
      title,
      description,
      entity: {
        type: channel === "meeting" ? "meeting" : "follow-up",
        id: claimedFollowUp._id,
      },
      action: {
        label: channel === "meeting" ? "View meeting" : "View follow-up",
        href: `/dashboard/follow-ups/${claimedFollowUp._id}`,
      },
    });

    return true;
  } catch (error) {
    await FollowUp.updateOne(
      {
        _id: claimedFollowUp._id,
        overdueNotificationSentAt: claimedAt,
      },
      {
        $set: {
          overdueNotificationSentAt: null,
        },
      },
    );

    console.error(
      `Failed to process overdue follow-up ${followUp._id}:`,
      error,
    );

    return false;
  }
};

export const runOverdueNotificationJob = async () => {
  if (isRunning) {
    return;
  }

  isRunning = true;

  try {
    const now = new Date();

    const overdueFollowUps = await FollowUp.find({
      status: "scheduled",
      scheduledAt: {
        $lt: now,
      },
      overdueNotificationSentAt: null,
    })
      .select("_id businessId lead type scheduledAt")
      .sort({
        scheduledAt: 1,
      })
      .limit(200)
      .lean();

    if (!overdueFollowUps.length) {
      return;
    }

    const ownerCache = new Map();

    for (const followUp of overdueFollowUps) {
      await processOverdueFollowUp(followUp, ownerCache);
    }
  } catch (error) {
    console.error("Overdue notification scheduler failed:", error);
  } finally {
    isRunning = false;
  }
};

export const startNotificationScheduler = () => {
  if (schedulerTimer) {
    return;
  }

  const interval = getSchedulerInterval();

  void runOverdueNotificationJob();

  schedulerTimer = setInterval(() => {
    void runOverdueNotificationJob();
  }, interval);

  schedulerTimer.unref?.();

  console.log(`Notification scheduler started (interval: ${interval}ms)`);
};

export const stopNotificationScheduler = () => {
  if (!schedulerTimer) {
    return;
  }

  clearInterval(schedulerTimer);

  schedulerTimer = null;

  console.log("Notification scheduler stopped");
};

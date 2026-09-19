import Notification from "../models/notification.model.js";
import { emitNotification } from "../realtime/socket.js";

import AppError from "../utils/AppError.js";

const NOTIFICATION_TYPES = [
  "hot-lead",
  "overdue",
  "meeting",
  "assigned",
  "completed",
  "system",
];

const ENTITY_TYPES = ["lead", "follow-up", "meeting", "activity", "system"];

const getNotificationFilter = (businessId, recipientId) => {
  if (!businessId || !recipientId) {
    throw new AppError("Business and recipient are required", 400);
  }

  return {
    businessId,
    recipientId,
  };
};

const validateNotificationType = (type) => {
  if (!NOTIFICATION_TYPES.includes(type)) {
    throw new AppError("Invalid notification type", 400);
  }
};

const normalizeOptionalString = (value, fieldName, maxLength) => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new AppError(`${fieldName} must be a string`, 400);
  }

  const normalized = value.trim();

  if (normalized.length > maxLength) {
    throw new AppError(
      `${fieldName} must not exceed ${maxLength} characters`,
      400,
    );
  }

  return normalized || null;
};

export const createNotification = async ({
  businessId,
  recipientId,
  type,
  title,
  description,
  entity = null,
  action = null,
}) => {
  if (!businessId || !recipientId) {
    throw new AppError("Business and recipient are required", 400);
  }

  validateNotificationType(type);

  const normalizedTitle = normalizeOptionalString(
    title,
    "Notification title",
    200,
  );

  const normalizedDescription = normalizeOptionalString(
    description,
    "Notification description",
    1000,
  );

  if (!normalizedTitle) {
    throw new AppError("Notification title is required", 400);
  }

  if (!normalizedDescription) {
    throw new AppError("Notification description is required", 400);
  }

  let normalizedEntity = null;

  if (entity !== undefined && entity !== null) {
    if (typeof entity !== "object" || Array.isArray(entity)) {
      throw new AppError("Notification entity must be an object", 400);
    }

    if (entity.type !== undefined && entity.type !== null) {
      if (!ENTITY_TYPES.includes(entity.type)) {
        throw new AppError("Invalid notification entity type", 400);
      }
    }

    normalizedEntity = {
      type: entity.type ?? null,
      id: entity.id ?? null,
    };
  }

  let normalizedAction = null;

  if (action !== undefined && action !== null) {
    if (typeof action !== "object" || Array.isArray(action)) {
      throw new AppError("Notification action must be an object", 400);
    }

    normalizedAction = {
      label: normalizeOptionalString(
        action.label,
        "Notification action label",
        80,
      ),
      href: normalizeOptionalString(
        action.href,
        "Notification action href",
        500,
      ),
    };
  }

  const notification = await Notification.create({
    businessId,
    recipientId,
    type,
    title: normalizedTitle,
    description: normalizedDescription,
    entity: normalizedEntity,
    action: normalizedAction,
  });

  const notificationData = notification.toObject();

  emitNotification(notificationData);

  return notificationData;
};

export const getNotifications = async (
  businessId,
  recipientId,
  { page = 1, limit = 20, unreadOnly = false } = {},
) => {
  const filter = getNotificationFilter(businessId, recipientId);

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  if (!Number.isInteger(parsedPage) || parsedPage < 1) {
    throw new AppError("Page must be a positive integer", 400);
  }

  if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
    throw new AppError("Limit must be between 1 and 100", 400);
  }

  if (unreadOnly) {
    filter.isRead = false;
  }

  const skip = (parsedPage - 1) * parsedLimit;

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(parsedLimit)
      .lean(),

    Notification.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / parsedLimit);

  return {
    notifications,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages,
      hasNextPage: parsedPage < totalPages,
      hasPreviousPage: parsedPage > 1,
    },
  };
};

export const getUnreadCount = async (businessId, recipientId) => {
  const filter = getNotificationFilter(businessId, recipientId);

  return Notification.countDocuments({
    ...filter,
    isRead: false,
  });
};

export const markNotificationAsRead = async (
  businessId,
  recipientId,
  notificationId,
) => {
  const filter = getNotificationFilter(businessId, recipientId);

  if (!notificationId) {
    throw new AppError("Notification ID is required", 400);
  }

  const notification = await Notification.findOneAndUpdate(
    {
      ...filter,
      _id: notificationId,
    },
    {
      $set: {
        isRead: true,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  ).lean();

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  return notification;
};

export const markAllNotificationsAsRead = async (businessId, recipientId) => {
  const filter = getNotificationFilter(businessId, recipientId);

  const result = await Notification.updateMany(
    {
      ...filter,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
      },
    },
  );

  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  };
};

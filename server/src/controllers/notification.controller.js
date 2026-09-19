import asyncHandler from "../utils/asyncHandler.js";

import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notification.service.js";

export const getAll = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly = false } = req.query;

  const notifications = await getNotifications(
    req.user.businessId,
    req.user.userId,
    {
      page,
      limit,
      unreadOnly: unreadOnly === true || unreadOnly === "true",
    },
  );

  res.status(200).json({
    success: true,
    message: "Notifications retrieved successfully",
    data: notifications,
  });
});

export const getUnread = asyncHandler(async (req, res) => {
  const count = await getUnreadCount(req.user.businessId, req.user.userId);

  res.status(200).json({
    success: true,
    message: "Unread notification count retrieved successfully",
    data: {
      count,
    },
  });
});

export const markRead = asyncHandler(async (req, res) => {
  const notification = await markNotificationAsRead(
    req.user.businessId,
    req.user.userId,
    req.params.notificationId,
  );

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
    data: {
      notification,
    },
  });
});

export const markAllRead = asyncHandler(async (req, res) => {
  const result = await markAllNotificationsAsRead(
    req.user.businessId,
    req.user.userId,
  );

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
    data: result,
  });
});

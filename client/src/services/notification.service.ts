import api from "@/lib/api";

export type NotificationType =
  | "hot-lead"
  | "overdue"
  | "meeting"
  | "assigned"
  | "completed"
  | "system";

export type NotificationEntityType =
  | "lead"
  | "follow-up"
  | "meeting"
  | "activity"
  | "system";

export type NotificationEntity = {
  type: NotificationEntityType | null;
  id: string | null;
};

export type NotificationAction = {
  label: string | null;
  href: string | null;
};

export type Notification = {
  _id: string;
  businessId: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  description: string;
  entity: NotificationEntity | null;
  action: NotificationAction | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NotificationPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type NotificationListData = {
  notifications: Notification[];
  pagination: NotificationPagination;
};

type NotificationListApiResponse = {
  success: boolean;
  message: string;
  data: NotificationListData;
};

type UnreadCountApiResponse = {
  success: boolean;
  message: string;
  data: {
    count: number;
  };
};

type NotificationApiResponse = {
  success: boolean;
  message: string;
  data: {
    notification: Notification;
  };
};

type MarkAllReadApiResponse = {
  success: boolean;
  message: string;
  data: {
    matchedCount: number;
    modifiedCount: number;
  };
};

export type GetNotificationsParams = {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
};

export const getNotifications = async (
  params: GetNotificationsParams = {},
): Promise<NotificationListData> => {
  const response = await api.get<NotificationListApiResponse>(
    "/notifications",
    {
      params,
    },
  );

  return response.data.data;
};

export const getUnreadNotificationCount = async (): Promise<number> => {
  const response = await api.get<UnreadCountApiResponse>(
    "/notifications/unread-count",
  );

  return response.data.data.count;
};

export const markNotificationAsRead = async (
  notificationId: string,
): Promise<Notification> => {
  const response = await api.patch<NotificationApiResponse>(
    `/notifications/${notificationId}/read`,
  );

  return response.data.data.notification;
};

export const markAllNotificationsAsRead = async (): Promise<{
  matchedCount: number;
  modifiedCount: number;
}> => {
  const response = await api.patch<MarkAllReadApiResponse>(
    "/notifications/read-all",
  );

  return response.data.data;
};

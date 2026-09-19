"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { toast } from "sonner";

import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket";

import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type Notification,
} from "@/services/notification.service";

type NotificationContextValue = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refreshNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

const MAX_NOTIFICATIONS = 100;

const mergeNotifications = (
  current: Notification[],
  incoming: Notification[],
): Notification[] => {
  const map = new Map<string, Notification>();

  for (const notification of current) {
    map.set(notification._id, notification);
  }

  for (const notification of incoming) {
    map.set(notification._id, notification);
  }

  return Array.from(map.values())
    .sort(
      (first, second) =>
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime(),
    )
    .slice(0, MAX_NOTIFICATIONS);
};

const shouldShowToast = (type: Notification["type"]): boolean => {
  return (
    type === "hot-lead" ||
    type === "overdue" ||
    type === "meeting" ||
    type === "assigned"
  );
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const seenNotificationIdsRef = useRef<Set<string>>(new Set());

  const showNotificationToast = useCallback((notification: Notification) => {
    if (!shouldShowToast(notification.type)) {
      return;
    }

    const toastKey = `toast:${notification._id}`;

    if (seenNotificationIdsRef.current.has(toastKey)) {
      return;
    }

    seenNotificationIdsRef.current.add(toastKey);

    toast(notification.title, {
      description: notification.description,
      duration: 6000,
    });
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      setError(null);

      const [notificationData, unreadTotal] = await Promise.all([
        getNotifications({
          page: 1,
          limit: 50,
        }),
        getUnreadNotificationCount(),
      ]);

      setNotifications(notificationData.notifications);

      setUnreadCount(unreadTotal);

      for (const notification of notificationData.notifications) {
        seenNotificationIdsRef.current.add(notification._id);
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);

      if (error instanceof Error && error.message) {
        setError(error.message);
      } else {
        setError("Unable to load notifications.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const syncNotifications = useCallback(async () => {
    try {
      const [notificationData, unreadTotal] = await Promise.all([
        getNotifications({
          page: 1,
          limit: 50,
        }),
        getUnreadNotificationCount(),
      ]);

      setNotifications(notificationData.notifications);

      setUnreadCount(unreadTotal);

      setError(null);

      for (const notification of notificationData.notifications) {
        seenNotificationIdsRef.current.add(notification._id);
      }
    } catch (error) {
      console.error("Failed to synchronize notifications:", error);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    const socket = getSocket();

    const handleNewNotification = (notification: Notification) => {
      if (seenNotificationIdsRef.current.has(notification._id)) {
        return;
      }

      seenNotificationIdsRef.current.add(notification._id);

      setNotifications((current) =>
        mergeNotifications(current, [notification]),
      );

      if (!notification.isRead) {
        setUnreadCount((current) => current + 1);
      }

      showNotificationToast(notification);
    };

    const handleConnect = () => {
      void syncNotifications();
    };

    socket.on("notification:new", handleNewNotification);

    socket.on("connect", handleConnect);

    connectSocket();

    return () => {
      socket.off("notification:new", handleNewNotification);

      socket.off("connect", handleConnect);

      disconnectSocket();
    };
  }, [showNotificationToast, syncNotifications]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      const target = notifications.find(
        (notification) => notification._id === notificationId,
      );

      if (!target || target.isRead) {
        return;
      }

      try {
        const updatedNotification =
          await markNotificationAsRead(notificationId);

        setNotifications((current) =>
          current.map((notification) =>
            notification._id === notificationId
              ? updatedNotification
              : notification,
          ),
        );

        setUnreadCount((current) => Math.max(0, current - 1));
      } catch (error) {
        console.error("Failed to mark notification as read:", error);

        throw error;
      }
    },
    [notifications],
  );

  const markAllAsRead = useCallback(async () => {
    if (unreadCount === 0) {
      return;
    }

    try {
      await markAllNotificationsAsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);

      throw error;
    }
  }, [unreadCount]);

  const refreshNotifications = useCallback(async () => {
    setLoading(true);

    try {
      await syncNotifications();
    } finally {
      setLoading(false);
    }
  }, [syncNotifications]);

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      unreadCount,
      loading,
      error,
      refreshNotifications,
      markAsRead,
      markAllAsRead,
    }),
    [
      notifications,
      unreadCount,
      loading,
      error,
      refreshNotifications,
      markAsRead,
      markAllAsRead,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = (): NotificationContextValue => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider",
    );
  }

  return context;
};

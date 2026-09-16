import NotificationPreferences from "@/components/notifications/NotificationPreferences";
import NotificationList from "@/components/notifications/NotificationList";
import NotificationsHeader from "@/components/notifications/NotificationsHeader";
import NotificationSummary from "@/components/notifications/NotificationSummary";

export default function NotificationsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      <NotificationsHeader />

      <NotificationSummary />

      <NotificationList />

      <NotificationPreferences />
    </div>
  );
}

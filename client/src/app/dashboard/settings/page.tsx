import AccountSettings from "@/components/settings/AccountSettings";
import AIPreferences from "@/components/settings/AIPreferences";
import NotificationSettings from "@/components/settings/NotificationSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import SettingsHeader from "@/components/settings/SettingsHeader";
import TeamAccessSettings from "@/components/settings/TeamAccessSettings";
import WorkspaceSettings from "@/components/settings/WorkspaceSettings";

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      <SettingsHeader />

      <AccountSettings />

      <WorkspaceSettings />

      <TeamAccessSettings />

      <NotificationSettings />

      <AIPreferences />

      <SecuritySettings />
    </div>
  );
}

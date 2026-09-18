import api from "@/lib/api";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export type AccountSettings = {
  name: string;
  email: string;
  timezone: string;
  avatar: string | null;
};

export type WorkspaceSettings = {
  name: string;
  industry: string | null;
  website: string | null;
  location: string | null;
};

export type NotificationSettings = {
  inApp: boolean;
  email: boolean;
  browser: boolean;
  teamActivity: boolean;
};

export type AIPreferences = {
  automaticQualification: boolean;
  leadSummary: boolean;
  suggestedNextAction: boolean;
  scoringMode: "balanced" | "intent" | "engagement";
};

export type Settings = {
  account: AccountSettings;
  workspace: WorkspaceSettings;
  notifications: NotificationSettings;
  ai: AIPreferences;
  meta: {
    updatedAt: string | null;
  };
};

/* -------------------------------------------------------------------------- */
/* UPDATE PAYLOADS                                                            */
/* -------------------------------------------------------------------------- */

export type UpdateAccountSettingsPayload = Partial<AccountSettings>;

export type UpdateWorkspaceSettingsPayload = Partial<WorkspaceSettings>;

export type UpdateNotificationSettingsPayload = Partial<NotificationSettings>;

export type UpdateAIPreferencesPayload = Partial<AIPreferences>;

export type UpdateSettingsPayload = {
  account?: UpdateAccountSettingsPayload;
  workspace?: UpdateWorkspaceSettingsPayload;
  notifications?: UpdateNotificationSettingsPayload;
  ai?: UpdateAIPreferencesPayload;
};

/* -------------------------------------------------------------------------- */
/* API RESPONSE                                                               */
/* -------------------------------------------------------------------------- */

type SettingsApiResponse = {
  success: boolean;
  message: string;
  data: {
    settings: Settings;
  };
};

/* -------------------------------------------------------------------------- */
/* GET SETTINGS                                                               */
/* -------------------------------------------------------------------------- */

export const getSettings = async (): Promise<Settings> => {
  const response = await api.get<SettingsApiResponse>("/settings");

  return response.data.data.settings;
};

/* -------------------------------------------------------------------------- */
/* UPDATE SETTINGS                                                            */
/* -------------------------------------------------------------------------- */

export const updateSettings = async (
  payload: UpdateSettingsPayload,
): Promise<Settings> => {
  const response = await api.patch<SettingsApiResponse>("/settings", payload);

  return response.data.data.settings;
};

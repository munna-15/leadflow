import api from "@/lib/api";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export type PlatformSettings = {
  account: {
    id: string;
    name: string;
    email: string;
    accountType: string;
    accessLevel: string;
  };

  invitations: {
    delivery: string;
    flow: string;
    pending: number;
    accepted: number;
  };

  security: {
    privatePlatform: boolean;
    workspaceIsolation: boolean;
    authentication: string;
  };

  preferences: {
    environment: string;
    operationalNotifications: string;
  };
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

/* -------------------------------------------------------------------------- */
/* GET PLATFORM SETTINGS                                                      */
/* -------------------------------------------------------------------------- */

export const getPlatformSettings = async (): Promise<PlatformSettings> => {
  const response =
    await api.get<ApiResponse<PlatformSettings>>("/platform/settings");

  return response.data.data;
};

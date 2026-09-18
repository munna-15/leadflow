import api from "@/lib/api";

import type { LeadStatus, LeadTemperature } from "@/services/lead.service";

export type FollowUpType = "call" | "message" | "email" | "meeting" | "other";

export type FollowUpStatus = "scheduled" | "completed" | "cancelled";

export interface FollowUpLead {
  _id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: LeadStatus;
  temperature: LeadTemperature;
  score: number;
}

export interface FollowUp {
  _id: string;
  businessId: string;
  lead: FollowUpLead;
  type: FollowUpType;
  scheduledAt: string;
  status: FollowUpStatus;
  notes: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface FollowUpsResponse {
  success: boolean;
  message: string;
  data: {
    followUps: FollowUp[];
  };
}

interface FollowUpResponse {
  success: boolean;
  message: string;
  data: {
    followUp: FollowUp;
  };
}

interface FollowUpActionResponse {
  success: boolean;
  message: string;
  data?: {
    followUp?: FollowUp;
  };
}

export const getFollowUps = async (params?: {
  status?: FollowUpStatus;
  type?: FollowUpType;
  lead?: string;
}) => {
  const response = await api.get<FollowUpsResponse>("/follow-ups", {
    params,
  });

  return response.data.data.followUps;
};

export const getFollowUpById = async (followUpId: string) => {
  const response = await api.get<FollowUpResponse>(`/follow-ups/${followUpId}`);

  return response.data.data.followUp;
};

export const createFollowUp = async (payload: {
  lead: string;
  type: FollowUpType;
  scheduledAt: string;
  notes?: string | null;
}) => {
  const response = await api.post<FollowUpResponse>("/follow-ups", payload);

  return response.data.data.followUp;
};

export const updateFollowUp = async (
  followUpId: string,
  payload: Partial<{
    type: FollowUpType;
    scheduledAt: string;
    status: FollowUpStatus;
    notes: string | null;
  }>,
) => {
  const response = await api.patch<FollowUpResponse>(
    `/follow-ups/${followUpId}`,
    payload,
  );

  return response.data.data.followUp;
};

export const completeFollowUp = async (followUpId: string) => {
  const response = await api.patch<FollowUpActionResponse>(
    `/follow-ups/${followUpId}`,
    {
      status: "completed",
    },
  );

  return response.data.data?.followUp ?? null;
};

export const cancelFollowUp = async (followUpId: string) => {
  const response = await api.patch<FollowUpActionResponse>(
    `/follow-ups/${followUpId}`,
    {
      status: "cancelled",
    },
  );

  return response.data.data?.followUp ?? null;
};

export const deleteFollowUp = async (followUpId: string) => {
  const response = await api.delete(`/follow-ups/${followUpId}`);

  return response.data;
};

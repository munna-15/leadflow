import api from "@/lib/api";

export type ActivityType =
  | "lead_created"
  | "lead_assigned"
  | "lead_updated"
  | "status_changed"
  | "temperature_changed"
  | "follow_up_scheduled"
  | "follow_up_rescheduled"
  | "follow_up_completed"
  | "follow_up_cancelled";

export type ActivityLead = {
  _id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  temperature: "hot" | "warm" | "cold";
  score: number;
};

export type ActivityActor = {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
};

export type Activity = {
  _id: string;
  businessId: string;
  lead: ActivityLead;
  actor: ActivityActor | null;
  type: ActivityType;
  title: string;
  description: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

type GetActivitiesResponse = {
  success: boolean;
  message: string;
  data: {
    activities: Activity[];
  };
};

export const getActivities = async (params?: {
  lead?: string;
  type?: ActivityType;
}) => {
  const response = await api.get<GetActivitiesResponse>("/activities", {
    params,
  });

  return response.data.data.activities;
};

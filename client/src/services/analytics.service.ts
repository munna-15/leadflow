import api from "@/lib/api";

export type AnalyticsRange = "7d" | "30d" | "90d";

export interface AnalyticsOverview {
  totalLeads: number;
  qualified: number;
  meetings: number;
  won: number;
  conversionRate: number;
}

export type AnalyticsPipelineStageId =
  | "new"
  | "qualified"
  | "contacted"
  | "meeting"
  | "negotiation";

export interface AnalyticsPipelineStage {
  id: AnalyticsPipelineStageId;
  label: string;
  count: number;
}

export interface AnalyticsPipeline {
  stages: AnalyticsPipelineStage[];
  won: number;
  lost: number;
}

export interface AnalyticsSource {
  source: string;
  name: string;
  leads: number;
  qualified: number;
  share: number;
  qualificationRate: number;
}

export interface AnalyticsTeamUser {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "sales";
  avatar: string | null;
}

export interface AnalyticsTeamMember {
  user: AnalyticsTeamUser;
  assignedLeads: number;
  qualifiedLeads: number;
  wonLeads: number;
  followUps: number;
  activities: number;
}

export type AnalyticsInsightType = "attention" | "priority";

export interface AnalyticsInsight {
  type: AnalyticsInsightType;
  title: string;
  description: string;
  metric: number;
  metricLabel: string;
  leadIds?: string[];
}

export interface AnalyticsMeta {
  range: AnalyticsRange;
  startDate: string;
  endDate: string;
  generatedAt: string;
}

export interface AnalyticsData {
  overview: AnalyticsOverview;
  pipeline: AnalyticsPipeline;
  sources: AnalyticsSource[];
  team: AnalyticsTeamMember[];
  insights: AnalyticsInsight[];
  meta: AnalyticsMeta;
}

interface AnalyticsResponse {
  success: boolean;
  message: string;
  data: AnalyticsData;
}

export const getAnalytics = async (range: AnalyticsRange = "30d") => {
  const response = await api.get<AnalyticsResponse>("/analytics", {
    params: {
      range,
    },
  });

  return response.data.data;
};

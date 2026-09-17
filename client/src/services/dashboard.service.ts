import api from "@/lib/api";

import type { Activity } from "@/services/activity.service";
import type { LeadTemperature } from "@/services/lead.service";

export type DashboardAttentionType =
  | "overdue_follow_up"
  | "high_intent"
  | "upcoming_follow_up";

export type DashboardAttentionPriority = "high" | "medium";

export interface DashboardAttentionItem {
  id: string;
  type: DashboardAttentionType;
  title: string;
  description: string;
  leadId: string;
  leadName: string;
  score: number;
  temperature: LeadTemperature;
  scheduledAt: string | null;
  priority: DashboardAttentionPriority;
}

export interface DashboardSummary {
  activeLeads: number;
  highIntentLeads: number;
  followUpsDue: number;
}

export interface DashboardPipelineStage {
  id: "new" | "qualified" | "contacted" | "meeting" | "negotiation";
  label: string;
  count: number;
}

export interface DashboardPipeline {
  stages: DashboardPipelineStage[];
  won: number;
  lost: number;
}

export interface DashboardMeta {
  generatedAt: string;
}

export interface DashboardData {
  summary: DashboardSummary;
  attentionItems: DashboardAttentionItem[];
  pipeline: DashboardPipeline;
  recentActivities: Activity[];
  meta: DashboardMeta;
}

interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

export const getDashboard = async () => {
  const response = await api.get<DashboardResponse>("/dashboard");

  return response.data.data;
};

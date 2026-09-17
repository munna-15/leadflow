import api from "@/lib/api";

import type { AssignedUser, LeadTemperature } from "@/services/lead.service";

export type PipelineStageKey =
  | "new"
  | "qualified"
  | "contacted"
  | "meeting"
  | "negotiation";

export type PipelineOutcomeKey = "won" | "lost";

export interface PipelineLead {
  id: string;
  name: string;
  detail: string;
  score: number;
  temperature: LeadTemperature;
  status: PipelineStageKey | PipelineOutcomeKey;
  source: string;
  email: string | null;
  phone: string | null;
  nextFollowUpAt: string | null;
  assignedTo: AssignedUser | null;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineSummary {
  total: number;
  active: number;
  new: number;
  qualified: number;
  contacted: number;
  meeting: number;
  negotiation: number;
  won: number;
  lost: number;
}

export interface PipelineStage {
  key: PipelineStageKey;
  label: string;
  description: string;
  count: number;
  leads: PipelineLead[];
}

export interface PipelineOutcome {
  key: PipelineOutcomeKey;
  label: string;
  description: string;
  count: number;
  leads: PipelineLead[];
}

export interface PipelineSignal {
  count: number;
  leads: PipelineLead[];
}

export interface PipelineSignals {
  hotLeads: PipelineSignal;
  highScoreLeads: PipelineSignal;
  attentionNeeded: PipelineSignal;
}

export interface PipelineData {
  summary: PipelineSummary;
  stages: PipelineStage[];
  outcomes: PipelineOutcome[];
  signals: PipelineSignals;
}

interface PipelineResponse {
  success: boolean;
  message: string;
  data: PipelineData;
}

export const getPipeline = async () => {
  const response = await api.get<PipelineResponse>("/pipeline");

  return response.data.data;
};

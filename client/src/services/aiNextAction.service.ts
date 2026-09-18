import api from "@/lib/api";

export type NextAction =
  | "call"
  | "message"
  | "email"
  | "schedule_follow_up"
  | "review_lead"
  | "wait";

export type NextActionTiming =
  | "now"
  | "today"
  | "tomorrow"
  | "this_week"
  | "scheduled"
  | "no_action";

export type NextActionPriority = "high" | "medium" | "low";

export interface LeadNextActionSummary {
  _id: string;
  name: string;
  score: number;
  temperature: "hot" | "warm" | "cold";
  status:
    | "new"
    | "qualified"
    | "contacted"
    | "meeting"
    | "negotiation"
    | "won"
    | "lost";
}

export interface AINextActionRecommendation {
  action: NextAction;
  timing: NextActionTiming;
  priority: NextActionPriority;
  reason: string;
  message: string;
  confidence: number;
  provider: string;
  model: string;
  generatedAt: string;
  lead: LeadNextActionSummary;
}

interface AINextActionResponse {
  success: boolean;
  message: string;
  data: {
    recommendation: AINextActionRecommendation;
  };
}

export const suggestLeadNextAction = async (
  leadId: string,
  businessContext?: string | null,
) => {
  const response = await api.post<AINextActionResponse>(
    `/leads/${leadId}/next-action`,
    businessContext
      ? {
          businessContext,
        }
      : {},
  );

  return response.data.data.recommendation;
};

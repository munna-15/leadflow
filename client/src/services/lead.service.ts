import api from "@/lib/api";

export type LeadStatus =
  | "new"
  | "qualified"
  | "contacted"
  | "meeting"
  | "negotiation"
  | "won"
  | "lost";

export type LeadTemperature = "hot" | "warm" | "cold";

export interface LeadRequirements {
  [key: string]: unknown;
}

export interface AssignedUser {
  _id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: "owner" | "admin" | "sales";
}

export interface Lead {
  _id: string;
  businessId: string;
  name: string;
  email: string | null;
  phone: string | null;
  source: string;
  status: LeadStatus;
  temperature: LeadTemperature;
  score: number;
  requirements: LeadRequirements;
  aiSummary: string | null;
  assignedTo: AssignedUser | null;
  nextFollowUpAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface LeadsResponse {
  success: boolean;
  message: string;
  data: {
    leads: Lead[];
  };
}

interface LeadResponse {
  success: boolean;
  message: string;
  data: {
    lead: Lead;
  };
}

export const getLeads = async (params?: {
  search?: string;
  status?: LeadStatus;
  temperature?: LeadTemperature;
  assignedTo?: string;
}) => {
  const response = await api.get<LeadsResponse>("/leads", {
    params,
  });

  return response.data.data.leads;
};

export const getLeadById = async (leadId: string) => {
  const response = await api.get<LeadResponse>(`/leads/${leadId}`);

  return response.data.data.lead;
};

export const createLead = async (payload: {
  name: string;
  email?: string | null;
  phone?: string | null;
  source?: string;
  status?: LeadStatus;
  temperature?: LeadTemperature;
  score?: number;
  requirements?: LeadRequirements;
  aiSummary?: string | null;
  assignedTo?: string | null;
  nextFollowUpAt?: string | null;
}) => {
  const response = await api.post<LeadResponse>("/leads", payload);

  return response.data.data.lead;
};

export const updateLead = async (
  leadId: string,
  payload: Partial<{
    name: string;
    email: string | null;
    phone: string | null;
    source: string;
    status: LeadStatus;
    temperature: LeadTemperature;
    score: number;
    requirements: LeadRequirements;
    aiSummary: string | null;
    assignedTo: string | null;
    nextFollowUpAt: string | null;
  }>,
) => {
  const response = await api.patch<LeadResponse>(`/leads/${leadId}`, payload);

  return response.data.data.lead;
};

export const deleteLead = async (leadId: string) => {
  const response = await api.delete(`/leads/${leadId}`);

  return response.data;
};

import api from "@/lib/api";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export type ClientWorkspaceOwner = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "sales";
  isActive: boolean;
  avatar: string | null;
};

export type ClientInvitationSummary = {
  id: string;
  status: "pending" | "accepted" | "revoked";
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
};

export type ClientWorkspace = {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  location: string | null;
  isActive: boolean;
  owner: ClientWorkspaceOwner | null;
  invitation: ClientInvitationSummary | null;
};

export type CreateClientWorkspacePayload = {
  name: string;
  email: string;
  businessName: string;
  industry?: string;
  website?: string;
  location?: string;
};

export type CreatedClientWorkspace = {
  client: {
    id: string;
    name: string;
    email: string;
    role: "owner";
    businessId: string;
    isActive: boolean;
  };

  business: {
    id: string;
    name: string;
    industry: string | null;
    website: string | null;
    location: string | null;
    isActive: boolean;
  };

  invitation: {
    id: string;
    email: string;
    status: "pending" | "accepted" | "revoked";
    expiresAt: string;
    emailSent: boolean;
    emailId: string | null;
    devInviteUrl?: string;
  };

  emailError: string | null;
};

export type UpdateClientWorkspacePayload = {
  name?: string;
  businessName?: string;
  industry?: string;
  website?: string;
  location?: string;
};

export type UpdatedClientWorkspace = {
  client: {
    id: string;
    name: string;
    email: string;
    role: "owner";
    businessId: string;
    isActive: boolean;
  };

  business: {
    id: string;
    name: string;
    industry: string | null;
    website: string | null;
    location: string | null;
    isActive: boolean;
  };

  invitation: {
    id: string;
    status: "pending" | "accepted" | "revoked";
    expiresAt: string;
    acceptedAt: string | null;
    createdAt: string;
  } | null;
};

export type DeletedClientWorkspace = {
  client: {
    id: string;
    name: string;
    email: string;
  };

  business: {
    id: string;
    name: string;
    isActive: boolean;
  };

  deleted: boolean;
};

export type ResendInvitationResult = {
  business: {
    id: string;
    name: string;
  };

  invitation: {
    id: string;
    email: string;
    status: "pending" | "accepted" | "revoked";
    expiresAt: string;
    emailSent: boolean;
    emailId: string | null;
    devInviteUrl?: string;
  };

  emailError: string | null;
};

export type InvitationDetails = {
  invitation: {
    id: string;
    email: string;
    name: string;
    role: "owner";
    expiresAt: string;
  };

  business: {
    id: string;
    name: string;
  };
};

export type AcceptInvitationResult = {
  user: {
    id: string;
    name: string;
    email: string;
    role: "owner";
    businessId: string;
    isActive: boolean;
  };

  business: {
    id: string;
    name: string;
  };
};

/* -------------------------------------------------------------------------- */
/* API RESPONSE TYPES                                                         */
/* -------------------------------------------------------------------------- */

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

/* -------------------------------------------------------------------------- */
/* GET CLIENT WORKSPACES                                                      */
/* -------------------------------------------------------------------------- */

export const getClientWorkspaces = async (): Promise<ClientWorkspace[]> => {
  const response =
    await api.get<ApiResponse<ClientWorkspace[]>>("/platform/clients");

  return response.data.data;
};

/* -------------------------------------------------------------------------- */
/* CREATE CLIENT WORKSPACE                                                    */
/* -------------------------------------------------------------------------- */

export const createClientWorkspace = async (
  payload: CreateClientWorkspacePayload,
): Promise<CreatedClientWorkspace> => {
  const response = await api.post<ApiResponse<CreatedClientWorkspace>>(
    "/platform/clients",
    payload,
  );

  return response.data.data;
};

/* -------------------------------------------------------------------------- */
/* UPDATE CLIENT WORKSPACE                                                    */
/* -------------------------------------------------------------------------- */

export const updateClientWorkspace = async (
  businessId: string,
  payload: UpdateClientWorkspacePayload,
): Promise<UpdatedClientWorkspace> => {
  const response = await api.patch<ApiResponse<UpdatedClientWorkspace>>(
    `/platform/clients/${businessId}`,
    payload,
  );

  return response.data.data;
};

/* -------------------------------------------------------------------------- */
/* DELETE CLIENT WORKSPACE                                                    */
/* -------------------------------------------------------------------------- */

export const deleteClientWorkspace = async (
  businessId: string,
): Promise<DeletedClientWorkspace> => {
  const response = await api.delete<ApiResponse<DeletedClientWorkspace>>(
    `/platform/clients/${businessId}`,
  );

  return response.data.data;
};

/* -------------------------------------------------------------------------- */
/* RESEND INVITATION                                                          */
/* -------------------------------------------------------------------------- */

export const resendClientInvitation = async (
  businessId: string,
): Promise<ResendInvitationResult> => {
  const response = await api.post<ApiResponse<ResendInvitationResult>>(
    `/platform/clients/${businessId}/invitation/resend`,
  );

  return response.data.data;
};

/* -------------------------------------------------------------------------- */
/* GET PUBLIC INVITATION                                                      */
/* -------------------------------------------------------------------------- */

export const getInvitationDetails = async (
  token: string,
): Promise<InvitationDetails> => {
  const response = await api.get<ApiResponse<InvitationDetails>>(
    `/platform/invitations/${encodeURIComponent(token)}`,
  );

  return response.data.data;
};

/* -------------------------------------------------------------------------- */
/* ACCEPT PUBLIC INVITATION                                                   */
/* -------------------------------------------------------------------------- */

export const acceptInvitation = async (
  token: string,
  password: string,
): Promise<AcceptInvitationResult> => {
  const response = await api.post<ApiResponse<AcceptInvitationResult>>(
    `/platform/invitations/${encodeURIComponent(token)}/accept`,
    {
      password,
    },
  );

  return response.data.data;
};

import api from "@/lib/api";

export type TeamRole = "owner" | "admin" | "sales";

export type TeamMemberStatus = "active" | "inactive";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: TeamRole;
  status: TeamMemberStatus;
  assignedLeads: number;
  createdAt: string;
};

type TeamApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type GetMembersResponse = TeamApiResponse<{
  members: TeamMember[];
}>;

type MemberResponse = TeamApiResponse<{
  member: TeamMember;
}>;

type RemoveMemberResponse = TeamApiResponse<{
  id: string;
}>;

export type InviteTeamMemberPayload = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "sales";
};

export type UpdateTeamMemberPayload = {
  name?: string;
  role?: "admin" | "sales";
  isActive?: boolean;
};

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const response = await api.get<GetMembersResponse>("/team");

  return response.data.data.members;
};

export const inviteTeamMember = async (
  payload: InviteTeamMemberPayload,
): Promise<TeamMember> => {
  const response = await api.post<MemberResponse>("/team/invite", payload);

  return response.data.data.member;
};

export const updateTeamMember = async (
  memberId: string,
  payload: UpdateTeamMemberPayload,
): Promise<TeamMember> => {
  const response = await api.patch<MemberResponse>(
    `/team/${memberId}`,
    payload,
  );

  return response.data.data.member;
};

export const removeTeamMember = async (memberId: string): Promise<string> => {
  const response = await api.delete<RemoveMemberResponse>(`/team/${memberId}`);

  return response.data.data.id;
};

import api from "@/lib/api";

export type GetStartedPayload = {
  name: string;
  businessName: string;
  email: string;
  businessType: string;
  website: string;
  teamSize: string;
  leadVolume: string;
  needs: string[];
  message: string;
};

export type GetStartedSubmission = {
  id: string;
  createdAt: string;
  status: "new";
  emailDelivered: boolean;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export const submitGetStartedRequest = async (
  payload: GetStartedPayload,
): Promise<GetStartedSubmission> => {
  const response = await api.post<ApiResponse<GetStartedSubmission>>(
    "/get-started",
    payload,
  );

  return response.data.data;
};

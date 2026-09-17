import api from "@/lib/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "sales";
  businessId: string;
}

export interface Business {
  id: string;
  name: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    business: Business;
  };
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    business: Business;
  };
}

export const register = async (payload: {
  name: string;
  businessName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const response = await api.post<RegisterResponse>("/auth/register", payload);

  return response.data.data;
};

export const login = async (payload: { email: string; password: string }) => {
  const response = await api.post<LoginResponse>("/auth/login", payload);

  return response.data.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");

  return response.data;
};

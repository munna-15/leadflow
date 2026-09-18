
import api from "@/lib/api";

type AvatarApiResponse = {
  success: boolean;
  message: string;
  data: {
    avatar: string | null;
    avatarPublicId: string | null;
  };
};

export const uploadAvatar = async (
  file: File,
): Promise<string | null> => {
  const formData = new FormData();

  formData.append("avatar", file);

  const response = await api.post<AvatarApiResponse>(
    "/auth/avatar",
    formData,
  );

  return response.data.data.avatar;
};

export const removeAvatar = async (): Promise<void> => {
  await api.delete("/auth/avatar");
};


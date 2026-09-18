
import asyncHandler from "../utils/asyncHandler.js";

import {
  uploadUserAvatar,
  removeUserAvatar,
} from "../services/avatar.service.js";

export const uploadAvatar = asyncHandler(
  async (req, res) => {
    const result = await uploadUserAvatar(
      req.user.userId,
      req.file,
    );

    res.status(200).json({
      success: true,
      message: "Profile photo updated successfully",
      data: {
        avatar: result.avatar,
        avatarPublicId: result.avatarPublicId,
      },
    });
  },
);

export const removeAvatar = asyncHandler(
  async (req, res) => {
    const result = await removeUserAvatar(
      req.user.userId,
    );

    res.status(200).json({
      success: true,
      message: "Profile photo removed successfully",
      data: {
        avatar: result.avatar,
        avatarPublicId: result.avatarPublicId,
      },
    });
  },
);


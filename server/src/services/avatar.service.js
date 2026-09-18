
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import cloudinary from "../config/cloudinary.js";

const AVATAR_FOLDER = "leadflow/avatars";

const uploadToCloudinary = (fileBuffer, userId) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: AVATAR_FOLDER,
        public_id: userId.toString(),
        overwrite: true,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary avatar upload failed:", {
            message: error.message,
            name: error.name,
            httpCode: error.http_code,
          });

          return reject(error);
        }

        resolve(result);
      },
    );

    uploadStream.on("error", reject);

    uploadStream.end(fileBuffer);
  });

export const uploadUserAvatar = async (userId, file) => {
  if (!userId) {
    throw new AppError("Authenticated user is required", 401);
  }

  if (!file?.buffer) {
    throw new AppError("Profile photo is required", 400);
  }

  const user = await User.findOne({
    _id: userId,
    isActive: true,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  let uploadResult;

  try {
    uploadResult = await uploadToCloudinary(
      file.buffer,
      user._id,
    );
  } catch (error) {
    console.error("Avatar Cloudinary upload failed:", error);

    throw new AppError(
      "Profile photo upload failed",
      502,
    );
  }

  if (!uploadResult?.secure_url || !uploadResult?.public_id) {
    throw new AppError(
      "Profile photo upload returned an invalid result",
      502,
    );
  }

  const previousPublicId = user.avatarPublicId;

  const updatedUser = await User.findOneAndUpdate(
    {
      _id: userId,
      isActive: true,
    },
    {
      $set: {
        avatar: uploadResult.secure_url,
        avatarPublicId: uploadResult.public_id,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  ).select("avatar avatarPublicId");

  if (!updatedUser) {
    try {
      await cloudinary.uploader.destroy(
        uploadResult.public_id,
        {
          resource_type: "image",
        },
      );
    } catch (error) {
      console.error(
        "Failed to clean up orphaned avatar:",
        error,
      );
    }

    throw new AppError(
      "Profile photo could not be saved",
      500,
    );
  }

  if (
    previousPublicId &&
    previousPublicId !== uploadResult.public_id
  ) {
    try {
      await cloudinary.uploader.destroy(
        previousPublicId,
        {
          resource_type: "image",
        },
      );
    } catch (error) {
      console.error(
        "Previous avatar cleanup failed:",
        error,
      );
    }
  }

  return {
    avatar: updatedUser.avatar,
    avatarPublicId: updatedUser.avatarPublicId,
  };
};

export const removeUserAvatar = async (userId) => {
  if (!userId) {
    throw new AppError("Authenticated user is required", 401);
  }

  const user = await User.findOne({
    _id: userId,
    isActive: true,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const previousPublicId = user.avatarPublicId;

  if (previousPublicId) {
    try {
      const result = await cloudinary.uploader.destroy(
        previousPublicId,
        {
          resource_type: "image",
        },
      );

      if (
        result.result !== "ok" &&
        result.result !== "not found"
      ) {
        throw new Error(
          "Cloudinary avatar removal was not confirmed",
        );
      }
    } catch (error) {
      console.error(
        "Cloudinary avatar removal failed:",
        error,
      );

      throw new AppError(
        "Profile photo removal failed",
        502,
      );
    }
  }

  user.avatar = null;
  user.avatarPublicId = null;

  await user.save();

  return {
    avatar: null,
    avatarPublicId: null,
  };
};


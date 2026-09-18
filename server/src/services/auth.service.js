import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import User from "../models/user.model.js";
import Business from "../models/business.model.js";
import AppError from "../utils/AppError.js";

import { signToken } from "../utils/jwt.js";

export const registerUser = async ({ name, email, password, businessName }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("An account with this email already exists", 409);
  }

  const session = await mongoose.startSession();

  try {
    let createdUser;
    let createdBusiness;

    await session.withTransaction(async () => {
      const passwordHash = await bcrypt.hash(password, 12);

      const [user] = await User.create(
        [
          {
            name,
            email,
            password: passwordHash,
            role: "owner",
            businessId: null,
          },
        ],
        { session },
      );

      const [business] = await Business.create(
        [
          {
            name: businessName,
            owner: user._id,
          },
        ],
        { session },
      );

      user.businessId = business._id;

      await user.save({ session });

      createdUser = user;
      createdBusiness = business;
    });

    return {
      user: {
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        businessId: createdUser.businessId,
      },

      business: {
        id: createdBusiness._id,
        name: createdBusiness.name,
      },
    };
  } catch (error) {
    if (error?.code === 11000) {
      throw new AppError("An account with this email already exists", 409);
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({
    email,
  }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AppError("This account is inactive", 403);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.businessId) {
    throw new AppError("User is not associated with a business", 403);
  }

  const business = await Business.findOne({
    _id: user.businessId,
    isActive: true,
  });

  if (!business) {
    throw new AppError("Business account is unavailable", 403);
  }

  const token = signToken({
    userId: user._id.toString(),
    businessId: user.businessId.toString(),
    role: user.role,
    tokenVersion: user.tokenVersion,
  });

  return {
    token,

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      businessId: user.businessId,
    },

    business: {
      id: business._id,
      name: business.name,
    },
  };
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  if (!userId) {
    throw new AppError("Authenticated user is required", 401);
  }

  if (!currentPassword || !newPassword) {
    throw new AppError("Current password and new password are required", 400);
  }

  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.isActive) {
    throw new AppError("This account is inactive", 403);
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isCurrentPasswordValid) {
    throw new AppError("Current password is incorrect", 401);
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);

  if (isSamePassword) {
    throw new AppError(
      "New password must be different from the current password",
      400,
    );
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  user.password = passwordHash;
  user.tokenVersion += 1;

  await user.save();

  return {
    tokenVersion: user.tokenVersion,
  };
};

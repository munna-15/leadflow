import asyncHandler from "../utils/asyncHandler.js";

import {
  registerUser,
  loginUser,
  changePassword as changePasswordService,
} from "../services/auth.service.js";

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  };
};

const getClearCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, businessName } = req.body;

  const result = await registerUser({
    name,
    email,
    password,
    businessName,
  });

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: result,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await loginUser({
    email,
    password,
  });

  res.cookie(
    process.env.COOKIE_NAME || "leadflow_token",
    result.token,
    getCookieOptions(),
  );

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: result.user,
      business: result.business,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(
    process.env.COOKIE_NAME || "leadflow_token",
    getClearCookieOptions(),
  );

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  await changePasswordService(req.user.userId, currentPassword, newPassword);

  res.clearCookie(
    process.env.COOKIE_NAME || "leadflow_token",
    getClearCookieOptions(),
  );

  res.status(200).json({
    success: true,
    message: "Password changed successfully. Please sign in again.",
  });
});

import User from "../models/user.model.js";

import AppError from "../utils/AppError.js";

import { verifyToken } from "../utils/jwt.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.[process.env.COOKIE_NAME || "leadflow_token"];

    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    const decoded = verifyToken(token);

    if (!decoded.userId || !decoded.businessId || !decoded.role) {
      throw new AppError("Invalid authentication", 401);
    }

    if (!Number.isInteger(decoded.tokenVersion)) {
      throw new AppError("Invalid authentication", 401);
    }

    const user = await User.findOne({
      _id: decoded.userId,
      businessId: decoded.businessId,
      isActive: true,
    })
      .select("role tokenVersion")
      .lean();

    if (!user) {
      throw new AppError("Authentication is no longer valid", 401);
    }

    if (user.tokenVersion !== decoded.tokenVersion) {
      throw new AppError("Authentication is no longer valid", 401);
    }

    if (user.role !== decoded.role) {
      throw new AppError("Authentication is no longer valid", 401);
    }

    req.user = {
      userId: decoded.userId,
      businessId: decoded.businessId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(new AppError("Invalid or expired authentication", 401));
  }
};

export default authMiddleware;

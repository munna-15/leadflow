import AppError from "../utils/AppError.js";
import { verifyToken } from "../utils/jwt.js";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.[process.env.COOKIE_NAME || "leadflow_token"];

    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    const decoded = verifyToken(token);

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

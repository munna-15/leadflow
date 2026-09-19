import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";


const normalizeEmail = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const getPlatformOwnerEmail = () =>
  normalizeEmail(process.env.PLATFORM_OWNER_EMAIL);



const requirePlatformAdmin = async (req, _res, next) => {
  try {
    const configuredEmail = getPlatformOwnerEmail();

    if (!configuredEmail) {
      throw new AppError("Platform owner access is not configured", 503);
    }

    if (!req.user?.userId) {
      throw new AppError("Authenticated user is required", 401);
    }

    const user = await User.findById(req.user.userId)
      .select("_id email isActive")
      .lean();

    if (!user || !user.isActive) {
      throw new AppError("Active platform access is required", 403);
    }

    const userEmail = normalizeEmail(user.email);

    if (userEmail !== configuredEmail) {
      throw new AppError("Platform access is required", 403);
    }

    req.platformUser = {
      userId: user._id.toString(),
      email: user.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default requirePlatformAdmin;

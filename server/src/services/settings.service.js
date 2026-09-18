import Settings from "../models/settings.model.js";
import User from "../models/user.model.js";
import Business from "../models/business.model.js";
import AppError from "../utils/AppError.js";

const getSettingsFilter = (userId, businessId) => {
  if (!userId || !businessId) {
    throw new AppError("Authenticated user and business are required", 401);
  }

  return {
    userId,
    businessId,
  };
};

export const getSettings = async (userId, businessId) => {
  const filter = getSettingsFilter(userId, businessId);

  const [user, business, settingsDocument] = await Promise.all([
    User.findOne({
      _id: userId,
      businessId,
    }).lean(),

    Business.findOne({
      _id: businessId,
      owner: userId,
    }).lean(),

    Settings.findOne(filter).lean(),
  ]);

  if (!user) {
    throw new AppError("Authenticated user was not found", 404);
  }

  if (!business) {
    throw new AppError("Business account was not found", 404);
  }

  let settings = settingsDocument;

  if (!settings) {
    settings = await Settings.create(filter);
    settings = settings.toObject();
  }

  return {
    account: {
      name: user.name,
      email: user.email,
      timezone: user.timezone,
      avatar: user.avatar,
    },

    workspace: {
      name: business.name,
      industry: business.industry,
      website: business.website,
      location: business.location,
    },

    notifications: settings.notifications,
    ai: settings.ai,

    meta: {
      updatedAt: settings.updatedAt,
    },
  };
};

export const updateSettings = async (userId, businessId, payload) => {
  const filter = getSettingsFilter(userId, businessId);

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new AppError("Settings payload is required", 400);
  }

  const hasAccount = payload.account && Object.keys(payload.account).length > 0;

  const hasWorkspace =
    payload.workspace && Object.keys(payload.workspace).length > 0;

  const hasNotifications =
    payload.notifications && Object.keys(payload.notifications).length > 0;

  const hasAI = payload.ai && Object.keys(payload.ai).length > 0;

  if (!hasAccount && !hasWorkspace && !hasNotifications && !hasAI) {
    throw new AppError("At least one settings field is required", 400);
  }

  const userUpdate = {};
  const businessUpdate = {};
  const settingsUpdate = {};

  if (hasAccount) {
    Object.entries(payload.account).forEach(([key, value]) => {
      userUpdate[key] = value;
    });
  }

  if (hasWorkspace) {
    Object.entries(payload.workspace).forEach(([key, value]) => {
      businessUpdate[key] = value;
    });
  }

  if (hasNotifications) {
    Object.entries(payload.notifications).forEach(([key, value]) => {
      settingsUpdate[`notifications.${key}`] = value;
    });
  }

  if (hasAI) {
    Object.entries(payload.ai).forEach(([key, value]) => {
      settingsUpdate[`ai.${key}`] = value;
    });
  }

  if (userUpdate.email) {
    const existingUser = await User.findOne({
      email: userUpdate.email,
      _id: { $ne: userId },
    }).lean();

    if (existingUser) {
      throw new AppError("An account with this email already exists", 409);
    }
  }

  const currentUser = await User.findOne({
    _id: userId,
    businessId,
  });

  if (!currentUser) {
    throw new AppError("Authenticated user was not found", 404);
  }

  const currentBusiness = await Business.findOne({
    _id: businessId,
    owner: userId,
  });

  if (!currentBusiness) {
    throw new AppError("Business account was not found", 404);
  }

  if (Object.keys(userUpdate).length > 0) {
    Object.assign(currentUser, userUpdate);

    await currentUser.save();
  }

  if (Object.keys(businessUpdate).length > 0) {
    Object.assign(currentBusiness, businessUpdate);

    await currentBusiness.save();
  }

  let settings;

  if (Object.keys(settingsUpdate).length > 0) {
    settings = await Settings.findOneAndUpdate(
      filter,
      {
        $set: settingsUpdate,
        $setOnInsert: filter,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    ).lean();
  } else {
    settings = await Settings.findOne(filter).lean();

    if (!settings) {
      settings = await Settings.create(filter);
      settings = settings.toObject();
    }
  }

  return {
    account: {
      name: currentUser.name,
      email: currentUser.email,
      timezone: currentUser.timezone,
      avatar: currentUser.avatar,
    },

    workspace: {
      name: currentBusiness.name,
      industry: currentBusiness.industry,
      website: currentBusiness.website,
      location: currentBusiness.location,
    },

    notifications: settings.notifications,
    ai: settings.ai,

    meta: {
      updatedAt: settings.updatedAt,
    },
  };
};

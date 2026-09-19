import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import User from "../models/user.model.js";
import Business from "../models/business.model.js";
import ClientInvitation from "../models/clientInvitation.model.js";

import AppError from "../utils/AppError.js";
import { sendLeadFlowInvitationEmail } from "./email.service.js";

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const INVITATION_VALID_DAYS = 7;
const BCRYPT_ROUNDS = 12;

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const normalizeEmail = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const normalizeText = (value) => String(value || "").trim();

const hashInvitationToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const generateInvitationToken = () => crypto.randomBytes(32).toString("hex");

const generateTemporaryPassword = () => crypto.randomBytes(32).toString("hex");

const buildInvitationUrl = (token) => {
  const clientUrl = normalizeText(process.env.CLIENT_APP_URL);

  if (!clientUrl) {
    throw new AppError("Client application URL is not configured", 503);
  }

  return new URL(
    `/auth/invite/${encodeURIComponent(token)}`,
    clientUrl.endsWith("/") ? clientUrl : `${clientUrl}/`,
  ).toString();
};

const shouldExposeDevelopmentInviteUrl = () =>
  process.env.NODE_ENV !== "production" &&
  String(process.env.EXPOSE_INVITE_URL_IN_DEVELOPMENT || "").toLowerCase() ===
    "true";

const getInvitationExpiry = () => {
  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + INVITATION_VALID_DAYS);

  return expiresAt;
};

const normalizeWebsite = (value) => {
  const normalized = normalizeText(value);

  if (!normalized) {
    return null;
  }

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }

  return `https://${normalized}`;
};

/* -------------------------------------------------------------------------- */
/* INPUT VALIDATION                                                           */
/* -------------------------------------------------------------------------- */

const assertValidClientInput = ({ name, email, businessName }) => {
  if (!name) {
    throw new AppError("Client name is required", 400);
  }

  if (name.length < 2 || name.length > 80) {
    throw new AppError("Client name must be between 2 and 80 characters", 400);
  }

  if (!email) {
    throw new AppError("Client email is required", 400);
  }

  if (!businessName) {
    throw new AppError("Business name is required", 400);
  }

  if (businessName.length > 120) {
    throw new AppError("Business name cannot exceed 120 characters", 400);
  }
};

const assertValidPassword = (password) => {
  if (!password) {
    throw new AppError("Password is required", 400);
  }

  if (password.length < 8) {
    throw new AppError("Password must be at least 8 characters", 400);
  }

  if (password.length > 128) {
    throw new AppError("Password cannot exceed 128 characters", 400);
  }
};

const assertValidClientUpdate = ({
  name,
  businessName,
  industry,
  website,
  location,
}) => {
  if (name !== undefined) {
    const normalizedName = normalizeText(name);

    if (!normalizedName) {
      throw new AppError("Client name cannot be empty", 400);
    }

    if (normalizedName.length < 2 || normalizedName.length > 80) {
      throw new AppError(
        "Client name must be between 2 and 80 characters",
        400,
      );
    }
  }

  if (businessName !== undefined) {
    const normalizedBusinessName = normalizeText(businessName);

    if (!normalizedBusinessName) {
      throw new AppError("Business name cannot be empty", 400);
    }

    if (normalizedBusinessName.length > 120) {
      throw new AppError("Business name cannot exceed 120 characters", 400);
    }
  }

  if (industry !== undefined && industry !== null) {
    if (normalizeText(industry).length > 120) {
      throw new AppError("Industry cannot exceed 120 characters", 400);
    }
  }

  if (location !== undefined && location !== null) {
    if (normalizeText(location).length > 160) {
      throw new AppError("Location cannot exceed 160 characters", 400);
    }
  }

  if (website !== undefined && website !== null) {
    const normalizedWebsite = normalizeText(website);

    if (normalizedWebsite) {
      const websiteWithProtocol =
        normalizedWebsite.startsWith("http://") ||
        normalizedWebsite.startsWith("https://")
          ? normalizedWebsite
          : `https://${normalizedWebsite}`;

      try {
        new URL(websiteWithProtocol);
      } catch {
        throw new AppError("A valid website URL is required", 400);
      }
    }
  }
};

/* -------------------------------------------------------------------------- */
/* PUBLIC RESPONSE HELPERS                                                    */
/* -------------------------------------------------------------------------- */

const getPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  businessId: user.businessId,
  isActive: user.isActive,
});

const getPublicBusiness = (business) => ({
  id: business._id,
  name: business.name,
  industry: business.industry,
  website: business.website,
  location: business.location,
  isActive: business.isActive,
});

/* -------------------------------------------------------------------------- */
/* CREATE CLIENT WORKSPACE                                                    */
/* -------------------------------------------------------------------------- */

export const createClientWorkspace = async ({
  name,
  email,
  businessName,
  industry = null,
  website = null,
  location = null,
  invitedBy,
}) => {
  const normalizedName = normalizeText(name);
  const normalizedEmail = normalizeEmail(email);
  const normalizedBusinessName = normalizeText(businessName);

  assertValidClientInput({
    name: normalizedName,
    email: normalizedEmail,
    businessName: normalizedBusinessName,
  });

  if (!invitedBy) {
    throw new AppError("Authenticated platform user is required", 401);
  }

  const existingUser = await User.findOne({
    email: normalizedEmail,
  })
    .select("_id email isActive businessId")
    .lean();

  if (existingUser) {
    throw new AppError("An account with this email already exists", 409);
  }

  const session = await mongoose.startSession();

  let createdUser;
  let createdBusiness;
  let createdInvitation;
  let rawInvitationToken;

  try {
    await session.withTransaction(async () => {
      const userId = new mongoose.Types.ObjectId();
      const businessId = new mongoose.Types.ObjectId();

      rawInvitationToken = generateInvitationToken();

      const tokenHash = hashInvitationToken(rawInvitationToken);

      const expiresAt = getInvitationExpiry();

      const temporaryPassword = generateTemporaryPassword();

      const temporaryPasswordHash = await bcrypt.hash(
        temporaryPassword,
        BCRYPT_ROUNDS,
      );

      const [user] = await User.create(
        [
          {
            _id: userId,
            name: normalizedName,
            email: normalizedEmail,
            password: temporaryPasswordHash,
            role: "owner",
            businessId,
            isActive: false,
          },
        ],
        { session },
      );

      const [business] = await Business.create(
        [
          {
            _id: businessId,
            name: normalizedBusinessName,
            owner: userId,
            industry: normalizeText(industry) || null,
            website: normalizeWebsite(website),
            location: normalizeText(location) || null,
            isActive: true,
          },
        ],
        { session },
      );

      const [invitation] = await ClientInvitation.create(
        [
          {
            businessId,
            userId,
            invitedBy,
            email: normalizedEmail,
            name: normalizedName,
            role: "owner",
            tokenHash,
            expiresAt,
            status: "pending",
          },
        ],
        { session },
      );

      createdUser = user;
      createdBusiness = business;
      createdInvitation = invitation;
    });
  } catch (error) {
    if (error?.code === 11000) {
      throw new AppError("An account with this email already exists", 409);
    }

    throw error;
  } finally {
    await session.endSession();
  }

  const invitationUrl = buildInvitationUrl(rawInvitationToken);

  let emailSent = false;
  let emailId = null;
  let emailError = null;

  try {
    const result = await sendLeadFlowInvitationEmail({
      invitationId: createdInvitation._id.toString(),
      email: createdInvitation.email,
      clientName: createdInvitation.name,
      businessName: createdBusiness.name,
      invitationUrl,
      expiresAt: createdInvitation.expiresAt,
    });

    emailSent = true;
    emailId = result.emailId;
  } catch (error) {
    emailError =
      error instanceof Error
        ? error.message
        : "Invitation email could not be delivered";

    console.error("LeadFlow invitation email failed:", error);
  }

  return {
    client: getPublicUser(createdUser),

    business: getPublicBusiness(createdBusiness),

    invitation: {
      id: createdInvitation._id,
      email: createdInvitation.email,
      status: createdInvitation.status,
      expiresAt: createdInvitation.expiresAt,
      emailSent,
      emailId,

      ...(shouldExposeDevelopmentInviteUrl()
        ? {
            devInviteUrl: invitationUrl,
          }
        : {}),
    },

    emailError:
      emailError && shouldExposeDevelopmentInviteUrl() ? emailError : null,
  };
};

/* -------------------------------------------------------------------------- */
/* LIST CLIENT WORKSPACES                                                     */
/* -------------------------------------------------------------------------- */

export const listClientWorkspaces = async ({ currentBusinessId } = {}) => {
  const businessFilter = {
    isActive: true,
  };

  if (currentBusinessId && mongoose.isValidObjectId(currentBusinessId)) {
    businessFilter._id = {
      $ne: currentBusinessId,
    };
  }

  const businesses = await Business.find(businessFilter)
    .sort({ createdAt: -1 })
    .populate({
      path: "owner",
      select: "_id name email role isActive businessId avatar",
    })
    .lean();

  if (!businesses.length) {
    return [];
  }

  const businessIds = businesses.map((business) => business._id);

  const invitations = await ClientInvitation.find({
    businessId: {
      $in: businessIds,
    },
  })
    .sort({ createdAt: -1 })
    .lean();

  const latestInvitationByBusiness = new Map();

  for (const invitation of invitations) {
    const key = invitation.businessId.toString();

    if (!latestInvitationByBusiness.has(key)) {
      latestInvitationByBusiness.set(key, invitation);
    }
  }

  return businesses.map((business) => {
    const owner = business.owner;

    const latestInvitation = latestInvitationByBusiness.get(
      business._id.toString(),
    );

    return {
      id: business._id,
      name: business.name,
      industry: business.industry,
      website: business.website,
      location: business.location,
      isActive: business.isActive,

      owner: owner
        ? {
            id: owner._id,
            name: owner.name,
            email: owner.email,
            role: owner.role,
            isActive: owner.isActive,
            avatar: owner.avatar || null,
          }
        : null,

      invitation: latestInvitation
        ? {
            id: latestInvitation._id,
            status: latestInvitation.status,
            expiresAt: latestInvitation.expiresAt,
            acceptedAt: latestInvitation.acceptedAt,
            createdAt: latestInvitation.createdAt,
          }
        : null,
    };
  });
};

/* -------------------------------------------------------------------------- */
/* UPDATE CLIENT WORKSPACE                                                    */
/* -------------------------------------------------------------------------- */

export const updateClientWorkspace = async ({
  businessId,
  currentBusinessId,
  name,
  businessName,
  industry,
  website,
  location,
}) => {
  if (!businessId) {
    throw new AppError("Business ID is required", 400);
  }

  if (!mongoose.isValidObjectId(businessId)) {
    throw new AppError("Invalid business ID", 400);
  }

  if (
    currentBusinessId &&
    mongoose.isValidObjectId(currentBusinessId) &&
    businessId === currentBusinessId.toString()
  ) {
    throw new AppError(
      "The platform owner's workspace cannot be modified",
      403,
    );
  }

  const hasUpdate =
    name !== undefined ||
    businessName !== undefined ||
    industry !== undefined ||
    website !== undefined ||
    location !== undefined;

  if (!hasUpdate) {
    throw new AppError("At least one client field is required", 400);
  }

  assertValidClientUpdate({
    name,
    businessName,
    industry,
    website,
    location,
  });

  const session = await mongoose.startSession();

  let updatedBusiness;
  let updatedOwner;

  try {
    await session.withTransaction(async () => {
      const business = await Business.findById(businessId).session(session);

      if (!business) {
        throw new AppError("Client workspace not found", 404);
      }

      if (!business.isActive) {
        throw new AppError("This client workspace is no longer active", 409);
      }

      const owner = await User.findOne({
        businessId: business._id,
        role: "owner",
      }).session(session);

      if (!owner) {
        throw new AppError("Client owner account not found", 404);
      }

      if (!owner.isActive) {
        throw new AppError("This client account is not active", 409);
      }

      if (businessName !== undefined) {
        business.name = normalizeText(businessName);
      }

      if (industry !== undefined) {
        business.industry = normalizeText(industry) || null;
      }

      if (website !== undefined) {
        business.website = normalizeWebsite(website);
      }

      if (location !== undefined) {
        business.location = normalizeText(location) || null;
      }

      if (name !== undefined) {
        owner.name = normalizeText(name);

        await ClientInvitation.updateMany(
          {
            businessId: business._id,
            userId: owner._id,
            status: "pending",
          },
          {
            $set: {
              name: owner.name,
            },
          },
          { session },
        );
      }

      await business.save({
        session,
      });

      await owner.save({
        session,
      });

      updatedBusiness = business;

      updatedOwner = owner;
    });
  } finally {
    await session.endSession();
  }

  const latestInvitation = await ClientInvitation.findOne({
    businessId: updatedBusiness._id,
  })
    .sort({ createdAt: -1 })
    .select("_id status expiresAt acceptedAt createdAt")
    .lean();

  return {
    client: getPublicUser(updatedOwner),

    business: getPublicBusiness(updatedBusiness),

    invitation: latestInvitation
      ? {
          id: latestInvitation._id,
          status: latestInvitation.status,
          expiresAt: latestInvitation.expiresAt,
          acceptedAt: latestInvitation.acceptedAt,
          createdAt: latestInvitation.createdAt,
        }
      : null,
  };
};

/* -------------------------------------------------------------------------- */
/* DELETE / ARCHIVE CLIENT WORKSPACE                                          */
/* -------------------------------------------------------------------------- */

export const deleteClientWorkspace = async ({
  businessId,
  currentBusinessId,
}) => {
  if (!businessId) {
    throw new AppError("Business ID is required", 400);
  }

  if (!mongoose.isValidObjectId(businessId)) {
    throw new AppError("Invalid business ID", 400);
  }

  if (
    currentBusinessId &&
    mongoose.isValidObjectId(currentBusinessId) &&
    businessId === currentBusinessId.toString()
  ) {
    throw new AppError("The platform owner's workspace cannot be deleted", 403);
  }

  const session = await mongoose.startSession();

  let deletedBusiness;
  let deletedOwner;

  try {
    await session.withTransaction(async () => {
      const business = await Business.findById(businessId).session(session);

      if (!business) {
        throw new AppError("Client workspace not found", 404);
      }

      if (!business.isActive) {
        throw new AppError(
          "This client workspace has already been deleted",
          409,
        );
      }

      const owner = await User.findOne({
        businessId: business._id,
        role: "owner",
      }).session(session);

      if (!owner) {
        throw new AppError("Client owner account not found", 404);
      }

      business.isActive = false;

      owner.isActive = false;

      owner.tokenVersion += 1;

      await business.save({
        session,
      });

      await owner.save({
        session,
      });

      await ClientInvitation.updateMany(
        {
          businessId: business._id,
          status: "pending",
        },
        {
          $set: {
            status: "revoked",
            revokedAt: new Date(),
          },
        },
        { session },
      );

      deletedBusiness = business;

      deletedOwner = owner;
    });
  } finally {
    await session.endSession();
  }

  return {
    client: {
      id: deletedOwner._id,
      name: deletedOwner.name,
      email: deletedOwner.email,
    },

    business: {
      id: deletedBusiness._id,
      name: deletedBusiness.name,
      isActive: deletedBusiness.isActive,
    },

    deleted: true,
  };
};

/* -------------------------------------------------------------------------- */
/* RESEND INVITATION                                                          */
/* -------------------------------------------------------------------------- */

export const resendClientInvitation = async ({ businessId, invitedBy }) => {
  if (!businessId) {
    throw new AppError("Business ID is required", 400);
  }

  if (!mongoose.isValidObjectId(businessId)) {
    throw new AppError("Invalid business ID", 400);
  }

  if (!invitedBy) {
    throw new AppError("Authenticated platform user is required", 401);
  }

  const business = await Business.findById(businessId).lean();

  if (!business) {
    throw new AppError("Client workspace not found", 404);
  }

  if (!business.isActive) {
    throw new AppError("This client workspace is no longer active", 409);
  }

  const user = await User.findOne({
    businessId: business._id,
    role: "owner",
  })
    .select("_id name email role businessId isActive")
    .lean();

  if (!user) {
    throw new AppError("Client owner account not found", 404);
  }

  if (user.isActive) {
    throw new AppError("This client account is already active", 409);
  }

  const rawInvitationToken = generateInvitationToken();

  const tokenHash = hashInvitationToken(rawInvitationToken);

  const expiresAt = getInvitationExpiry();

  const session = await mongoose.startSession();

  let invitation;

  try {
    await session.withTransaction(async () => {
      await ClientInvitation.updateMany(
        {
          businessId: business._id,
          userId: user._id,
          status: "pending",
        },
        {
          $set: {
            status: "revoked",
            revokedAt: new Date(),
          },
        },
        { session },
      );

      const [newInvitation] = await ClientInvitation.create(
        [
          {
            businessId: business._id,
            userId: user._id,
            invitedBy,
            email: user.email,
            name: user.name,
            role: "owner",
            tokenHash,
            expiresAt,
            status: "pending",
          },
        ],
        { session },
      );

      invitation = newInvitation;
    });
  } finally {
    await session.endSession();
  }

  const invitationUrl = buildInvitationUrl(rawInvitationToken);

  let emailSent = false;
  let emailId = null;
  let emailError = null;

  try {
    const result = await sendLeadFlowInvitationEmail({
      invitationId: invitation._id.toString(),
      email: user.email,
      clientName: user.name,
      businessName: business.name,
      invitationUrl,
      expiresAt,
    });

    emailSent = true;
    emailId = result.emailId;
  } catch (error) {
    emailError =
      error instanceof Error
        ? error.message
        : "Invitation email could not be delivered";

    console.error("LeadFlow resend invitation email failed:", error);
  }

  return {
    business: {
      id: business._id,
      name: business.name,
    },

    invitation: {
      id: invitation._id,
      email: invitation.email,
      status: invitation.status,
      expiresAt: invitation.expiresAt,
      emailSent,
      emailId,

      ...(shouldExposeDevelopmentInviteUrl()
        ? {
            devInviteUrl: invitationUrl,
          }
        : {}),
    },

    emailError:
      emailError && shouldExposeDevelopmentInviteUrl() ? emailError : null,
  };
};

/* -------------------------------------------------------------------------- */
/* PUBLIC INVITATION DETAILS                                                  */
/* -------------------------------------------------------------------------- */

export const getInvitation = async (token) => {
  const normalizedToken = normalizeText(token);

  if (!normalizedToken) {
    throw new AppError("Invitation is invalid or expired", 404);
  }

  const tokenHash = hashInvitationToken(normalizedToken);

  const invitation = await ClientInvitation.findOne({
    tokenHash,
    status: "pending",
    expiresAt: {
      $gt: new Date(),
    },
  })
    .populate({
      path: "businessId",
      select: "_id name isActive",
    })
    .populate({
      path: "userId",
      select: "_id name email role isActive businessId",
    })
    .lean();

  if (!invitation || !invitation.businessId || !invitation.userId) {
    throw new AppError("Invitation is invalid or expired", 404);
  }

  if (!invitation.businessId.isActive) {
    throw new AppError("This business workspace is unavailable", 403);
  }

  if (invitation.userId.isActive) {
    throw new AppError("This account has already been activated", 409);
  }

  return {
    invitation: {
      id: invitation._id,
      email: invitation.email,
      name: invitation.name,
      role: invitation.role,
      expiresAt: invitation.expiresAt,
    },

    business: {
      id: invitation.businessId._id,
      name: invitation.businessId.name,
    },
  };
};

/* -------------------------------------------------------------------------- */
/* ACCEPT INVITATION                                                          */
/* -------------------------------------------------------------------------- */

export const acceptInvitation = async ({ token, password }) => {
  const normalizedToken = normalizeText(token);

  if (!normalizedToken) {
    throw new AppError("Invitation is invalid or expired", 404);
  }

  assertValidPassword(password);

  const tokenHash = hashInvitationToken(normalizedToken);

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const session = await mongoose.startSession();

  let activatedUser;
  let business;

  try {
    await session.withTransaction(async () => {
      const invitation = await ClientInvitation.findOne({
        tokenHash,
        status: "pending",
        expiresAt: {
          $gt: new Date(),
        },
      })
        .session(session)
        .populate({
          path: "businessId",
          select: "_id name isActive",
        });

      if (!invitation) {
        throw new AppError("Invitation is invalid or expired", 404);
      }

      if (!invitation.businessId || !invitation.businessId.isActive) {
        throw new AppError("This business workspace is unavailable", 403);
      }

      const user = await User.findOne({
        _id: invitation.userId,
        businessId: invitation.businessId._id,
      })
        .select("_id name email password role businessId isActive tokenVersion")
        .session(session);

      if (!user) {
        throw new AppError("Client account could not be found", 404);
      }

      if (user.isActive) {
        throw new AppError("This account has already been activated", 409);
      }

      user.password = passwordHash;

      user.isActive = true;

      user.tokenVersion += 1;

      await user.save({
        session,
      });

      invitation.status = "accepted";

      invitation.acceptedAt = new Date();

      await invitation.save({
        session,
      });

      await ClientInvitation.updateMany(
        {
          _id: {
            $ne: invitation._id,
          },
          userId: user._id,
          status: "pending",
        },
        {
          $set: {
            status: "revoked",
            revokedAt: new Date(),
          },
        },
        { session },
      );

      activatedUser = user;

      business = invitation.businessId;
    });
  } finally {
    await session.endSession();
  }

  return {
    user: getPublicUser(activatedUser),

    business: {
      id: business._id,
      name: business.name,
    },
  };
};

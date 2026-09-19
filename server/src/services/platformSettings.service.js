import User from "../models/user.model.js";
import ClientInvitation from "../models/clientInvitation.model.js";
import AppError from "../utils/AppError.js";

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const normalizeEmail = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const getPlatformEnvironment = () => {
  const environment = String(process.env.NODE_ENV || "development")
    .trim()
    .toLowerCase();

  switch (environment) {
    case "production":
      return "Production";

    case "staging":
      return "Staging";

    default:
      return "Development";
  }
};

const getInvitationDeliveryStatus = () => {
  const resendConfigured = Boolean(
    String(process.env.RESEND_API_KEY || "").trim(),
  );

  return resendConfigured ? "Configured" : "Not configured";
};

/* -------------------------------------------------------------------------- */
/* GET PLATFORM SETTINGS                                                      */
/* -------------------------------------------------------------------------- */

const getPlatformSettings = async (userId) => {
  if (!userId) {
    throw new AppError("Authenticated user is required", 401);
  }

  /* ------------------------------------------------------------------------ */
  /* PLATFORM USER                                                             */
  /* ------------------------------------------------------------------------ */

  const user = await User.findById(userId)
    .select("_id name email isActive")
    .lean();

  if (!user || !user.isActive) {
    throw new AppError("Active platform access is required", 403);
  }

  /* ------------------------------------------------------------------------ */
  /* INVITATION METRICS                                                        */
  /* ------------------------------------------------------------------------ */

  const [pendingInvitations, acceptedInvitations] = await Promise.all([
    ClientInvitation.countDocuments({
      status: "pending",
      expiresAt: {
        $gt: new Date(),
      },
    }),

    ClientInvitation.countDocuments({
      status: "accepted",
    }),
  ]);

  /* ------------------------------------------------------------------------ */
  /* CONFIGURATION STATUS                                                      */
  /* ------------------------------------------------------------------------ */

  const invitationDelivery = getInvitationDeliveryStatus();

  const environment = getPlatformEnvironment();

  /* ------------------------------------------------------------------------ */
  /* RESPONSE                                                                  */
  /* ------------------------------------------------------------------------ */

  return {
    account: {
      id: user._id.toString(),
      name: user.name || "Platform administrator",
      email: normalizeEmail(user.email),
      accountType: "Platform administrator",
      accessLevel: "Private",
    },

    invitations: {
      delivery: invitationDelivery,
      flow: "Enabled",
      pending: pendingInvitations,
      accepted: acceptedInvitations,
    },

    security: {
      privatePlatform: true,
      workspaceIsolation: true,
      authentication: "JWT + Secure",
    },

    preferences: {
      environment,
      operationalNotifications:
        invitationDelivery === "Configured" ? "Enabled" : "Limited",
    },
  };
};

export default getPlatformSettings;

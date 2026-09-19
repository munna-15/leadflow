
import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import requirePlatformAdmin from "../middleware/platform.middleware.js";

import {
  acceptPublicInvitation,
  createClient,
  deleteClient,
  getClients,
  getPublicInvitation,
  resendInvitation,
  updateClient,
} from "../controllers/clientOnboarding.controller.js";

import {
  getPlatformSettingsController,
} from "../controllers/platformSettings.controller.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/* PLATFORM / CLIENT WORKSPACE ROUTES                                        */
/* -------------------------------------------------------------------------- */

router.use(
  ["/clients", "/settings"],
  authMiddleware,
  requirePlatformAdmin,
);

/* -------------------------------------------------------------------------- */
/* PLATFORM SETTINGS                                                          */
/* -------------------------------------------------------------------------- */

router.get(
  "/settings",
  getPlatformSettingsController,
);

/* -------------------------------------------------------------------------- */
/* CLIENT WORKSPACE MANAGEMENT                                                */
/* -------------------------------------------------------------------------- */

router.get(
  "/clients",
  getClients,
);

router.post(
  "/clients",
  createClient,
);

router.patch(
  "/clients/:businessId",
  updateClient,
);

router.delete(
  "/clients/:businessId",
  deleteClient,
);

router.post(
  "/clients/:businessId/invitation/resend",
  resendInvitation,
);

/* -------------------------------------------------------------------------- */
/* PUBLIC INVITATION ROUTES                                                   */
/* -------------------------------------------------------------------------- */

router.get(
  "/invitations/:token",
  getPublicInvitation,
);

router.post(
  "/invitations/:token/accept",
  acceptPublicInvitation,
);

export default router;


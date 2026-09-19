import asyncHandler from "../utils/asyncHandler.js";

import {
  acceptInvitation,
  createClientWorkspace,
  deleteClientWorkspace,
  getInvitation,
  listClientWorkspaces,
  resendClientInvitation,
  updateClientWorkspace,
} from "../services/clientOnboarding.service.js";

/* -------------------------------------------------------------------------- */
/* GET CLIENT WORKSPACES                                                      */
/* -------------------------------------------------------------------------- */

export const getClients = asyncHandler(async (req, res) => {
  const clients = await listClientWorkspaces({
    currentBusinessId: req.user.businessId,
  });

  res.status(200).json({
    success: true,
    data: clients,
  });
});

/* -------------------------------------------------------------------------- */
/* CREATE CLIENT WORKSPACE                                                    */
/* -------------------------------------------------------------------------- */

export const createClient = asyncHandler(async (req, res) => {
  const result = await createClientWorkspace({
    ...req.body,
    invitedBy: req.user.userId,
  });

  res.status(201).json({
    success: true,

    message: result.invitation.emailSent
      ? "Client workspace created and invitation sent."
      : "Client workspace created. Invitation email could not be delivered yet.",

    data: result,
  });
});

/* -------------------------------------------------------------------------- */
/* UPDATE CLIENT WORKSPACE                                                    */
/* -------------------------------------------------------------------------- */

export const updateClient = asyncHandler(async (req, res) => {
  const result = await updateClientWorkspace({
    businessId: req.params.businessId,

    currentBusinessId: req.user.businessId,

    ...req.body,
  });

  res.status(200).json({
    success: true,
    message: "Client workspace updated successfully.",
    data: result,
  });
});

/* -------------------------------------------------------------------------- */
/* DELETE CLIENT WORKSPACE                                                    */
/* -------------------------------------------------------------------------- */

export const deleteClient = asyncHandler(async (req, res) => {
  const result = await deleteClientWorkspace({
    businessId: req.params.businessId,

    currentBusinessId: req.user.businessId,
  });

  res.status(200).json({
    success: true,
    message: "Client workspace deleted and access revoked.",
    data: result,
  });
});

/* -------------------------------------------------------------------------- */
/* RESEND CLIENT INVITATION                                                   */
/* -------------------------------------------------------------------------- */

export const resendInvitation = asyncHandler(async (req, res) => {
  const result = await resendClientInvitation({
    businessId: req.params.businessId,

    invitedBy: req.user.userId,
  });

  res.status(200).json({
    success: true,

    message: result.invitation.emailSent
      ? "Invitation sent successfully."
      : "A new invitation was created, but email delivery is not available.",

    data: result,
  });
});

/* -------------------------------------------------------------------------- */
/* GET PUBLIC INVITATION                                                      */
/* -------------------------------------------------------------------------- */

export const getPublicInvitation = asyncHandler(async (req, res) => {
  const result = await getInvitation(req.params.token);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/* -------------------------------------------------------------------------- */
/* ACCEPT PUBLIC INVITATION                                                   */
/* -------------------------------------------------------------------------- */

export const acceptPublicInvitation = asyncHandler(async (req, res) => {
  const result = await acceptInvitation({
    token: req.params.token,
    password: req.body.password,
  });

  res.status(200).json({
    success: true,

    message: "Your LeadFlow account has been activated. You can now sign in.",

    data: result,
  });
});

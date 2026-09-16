import asyncHandler from "../utils/asyncHandler.js";

import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} from "../services/lead.service.js";

export const create = asyncHandler(async (req, res) => {
  const lead = await createLead(req.body, req.user.businessId);

  res.status(201).json({
    success: true,
    message: "Lead created successfully",
    data: {
      lead,
    },
  });
});

export const getAll = asyncHandler(async (req, res) => {
  const leads = await getLeads(req.user.businessId, {
    search: req.query.search,
    status: req.query.status,
    temperature: req.query.temperature,
    assignedTo: req.query.assignedTo,
  });

  res.status(200).json({
    success: true,
    message: "Leads fetched successfully",
    data: {
      leads,
    },
  });
});

export const getOne = asyncHandler(async (req, res) => {
  const lead = await getLeadById(req.params.id, req.user.businessId);

  res.status(200).json({
    success: true,
    message: "Lead fetched successfully",
    data: {
      lead,
    },
  });
});

export const update = asyncHandler(async (req, res) => {
  const lead = await updateLead(req.params.id, req.body, req.user.businessId);

  res.status(200).json({
    success: true,
    message: "Lead updated successfully",
    data: {
      lead,
    },
  });
});

export const remove = asyncHandler(async (req, res) => {
  await deleteLead(req.params.id, req.user.businessId);

  res.status(200).json({
    success: true,
    message: "Lead deleted successfully",
  });
});

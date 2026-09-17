import { getDashboardOverview } from "../services/dashboard.service.js";

export const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await getDashboardOverview(req.user.businessId);

    return res.status(200).json({
      success: true,
      message: "Dashboard loaded successfully",
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};

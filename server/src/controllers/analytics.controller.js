import { getAnalyticsOverview } from "../services/analytics.service.js";

export const getAnalytics = async (req, res, next) => {
  try {
    const range = req.query.range || "30d";

    const analytics = await getAnalyticsOverview(req.user.businessId, range);

    return res.status(200).json({
      success: true,
      message: "Analytics loaded successfully",
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};

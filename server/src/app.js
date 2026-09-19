import express from "express";

import cors from "cors";

import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import leadRoutes from "./routes/lead.routes.js";
import pipelineRoutes from "./routes/pipeline.routes.js";
import followUpRoutes from "./routes/followUp.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import aiNextActionRoutes from "./routes/aiNextAction.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import avatarRoutes from "./routes/avatar.routes.js";
import teamRoutes from "./routes/team.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import platformRoutes from "./routes/platform.routes.js";




import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LeadFlow API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/pipeline", pipelineRoutes);
app.use("/api/follow-ups", followUpRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api", aiNextActionRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/auth/avatar", avatarRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/platform", platformRoutes);


app.use(errorHandler);

export default app;

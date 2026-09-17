import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import leadRoutes from "./routes/lead.routes.js";
import pipelineRoutes from "./routes/pipeline.routes.js";

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

app.use(errorHandler);

export default app;

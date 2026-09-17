import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import { getPipelineOverview } from "../controllers/pipeline.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getPipelineOverview);

export default router;

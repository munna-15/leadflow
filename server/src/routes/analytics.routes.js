import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import { getAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAnalytics);

export default router;

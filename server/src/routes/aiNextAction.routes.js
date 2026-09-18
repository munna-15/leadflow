import express from "express";

import { suggestLeadNextAction } from "../controllers/aiNextAction.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/leads/:leadId/next-action", suggestLeadNextAction);

export default router;

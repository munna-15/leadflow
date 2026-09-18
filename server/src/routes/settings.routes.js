import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import { get, update } from "../controllers/settings.controller.js";

import { updateSettingsSchema } from "../validations/settings.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", get);

router.patch("/", validate(updateSettingsSchema), update);

export default router;

import express from "express";

import { submitGetStartedController } from "../controllers/getStarted.controller.js";

const router = express.Router();

router.post("/", submitGetStartedController);

export default router;

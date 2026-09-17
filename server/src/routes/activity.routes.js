import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import { getAll, getOne } from "../controllers/activity.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAll);

router.get("/:id", getOne);

export default router;

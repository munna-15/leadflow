import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  getAll,
  getUnread,
  markRead,
  markAllRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAll);

router.get("/unread-count", getUnread);

router.patch("/read-all", markAllRead);

router.patch("/:notificationId/read", markRead);

export default router;


import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import { uploadAvatar } from "../middleware/upload.middleware.js";

import {
  uploadAvatar as uploadAvatarController,
  removeAvatar as removeAvatarController,
} from "../controllers/avatar.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  uploadAvatar,
  uploadAvatarController,
);

router.delete(
  "/",
  removeAvatarController,
);

export default router;


import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  create,
  getAll,
  getOne,
  update,
  remove,
} from "../controllers/followUp.controller.js";

import {
  createFollowUpSchema,
  updateFollowUpSchema,
} from "../validations/followUp.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validate(createFollowUpSchema), create);

router.get("/", getAll);

router.get("/:id", getOne);

router.patch("/:id", validate(updateFollowUpSchema), update);

router.delete("/:id", remove);

export default router;

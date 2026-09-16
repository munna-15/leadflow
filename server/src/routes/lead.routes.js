import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  create,
  getAll,
  getOne,
  update,
  remove,
} from "../controllers/lead.controller.js";

import {
  createLeadSchema,
  updateLeadSchema,
} from "../validations/lead.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validate(createLeadSchema), create);

router.get("/", getAll);

router.get("/:id", getOne);

router.patch("/:id", validate(updateLeadSchema), update);

router.delete("/:id", remove);

export default router;

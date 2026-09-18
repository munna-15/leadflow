import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  register,
  login,
  logout,
  changePassword,
} from "../controllers/auth.controller.js";

import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} from "../validations/auth.validation.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.post("/logout", logout);

router.patch(
  "/password",
  authMiddleware,
  validate(changePasswordSchema),
  changePassword,
);

export default router;

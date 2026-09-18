import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  getMembers,
  inviteMember,
  updateMember,
  removeMember,
} from "../controllers/team.controller.js";

import {
  inviteTeamMemberSchema,
  updateTeamMemberSchema,
} from "../validations/team.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getMembers);

router.post("/invite", validate(inviteTeamMemberSchema), inviteMember);

router.patch("/:memberId", validate(updateTeamMemberSchema), updateMember);

router.delete("/:memberId", removeMember);

export default router;

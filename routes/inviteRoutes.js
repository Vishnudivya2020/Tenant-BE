import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";
import { inviteUser } from "../Controller/inviteController.js";

const router = express.Router();

// Admin invites new user to tenant
// router.post("/:slug/invite", authMiddleware, requireAdmin, inviteUser);
router.post("/:slug/invite", authMiddleware, requireAdmin, (req, res, next) => {
  console.log("➡️ Invite route hit:", req.method, req.originalUrl);
  next();
  }, inviteUser);

export default router;

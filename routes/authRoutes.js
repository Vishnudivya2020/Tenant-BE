import express from "express";
import { login,acceptInvite } from "../Controller/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/accept-invite",acceptInvite)

export default router;



import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";
import {upgradeTenant,getTenantInfo} from "../Controller/tenantController.js";

const router = express.Router();

// GET tenant info (Admin-only)
router.get("/upgrade", authMiddleware, requireAdmin, getTenantInfo);
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await user.findById(req.user.id).populate("tenant");
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.tenant) return res.status(404).json({ message: "Tenant not found" });

    res.json({
      slug: user.tenant.slug,
      name: user.tenant.name,
      id: user.tenant._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// POST /tenants/:slug/upgrade  (Admin-only)
router.post("/:slug/upgrade", authMiddleware, requireAdmin, upgradeTenant);

export default router;

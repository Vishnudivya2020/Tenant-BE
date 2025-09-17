
import Tenant from "../models/Tenant.js";

// GET tenant info
export const getTenantInfo = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can view tenant info" });
    }

    // Assume admin has only one tenant
    const tenant = await Tenant.findOne({ _id: req.user.tenant });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    res.json({ plan: tenant.plan, slug: tenant.slug });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// POST /tenants/:slug/upgrade
export const upgradeTenant = async (req, res) => {
  console.log("Received slug:", req.params.slug); // <-- check slug
  console.log("User:", req.user);
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can upgrade tenant" });
    }

    const tenant = await Tenant.findOne({ slug: req.params.slug });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    tenant.plan = "pro";
    await tenant.save();

    res.json({ message: "Tenant upgraded to Pro", plan: tenant.plan, slug: tenant.slug });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

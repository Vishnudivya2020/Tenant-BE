
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Tenant from "../models/Tenant.js";


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user and populate tenant object
    const user = await User.findOne({ email }).populate("tenant");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        tenant: {
          _id: user.tenant._id,
          name: user.tenant.name,
          slug: user.tenant.slug,
          plan: user.tenant.plan,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    // ✅ Return full user + tenant object
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenant: {
          _id: user.tenant._id,
          name: user.tenant.name,
          slug: user.tenant.slug,
          plan: user.tenant.plan,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ----------Accepting-Invite----------


const TEMP_PASSWORD = "TEMP_INVITE";

export const acceptInvite = async (req, res) => {
  const { token, password } = req.body;

  try {
    // Verify invite token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, tenantId } = decoded;

    // Find invited user
    const user = await User.findOne({ email, tenant: tenantId }).populate("tenant");
    if (!user) return res.status(404).json({ message: "Invitation not found" });

    if (user.password !== TEMP_PASSWORD) {
      return res.status(400).json({ message: "Invitation already accepted" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Invitation accepted successfully. Please log in." });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Invitation link expired" });
    }
    res.status(500).json({ message: err.message });
  }
};

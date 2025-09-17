

// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import Tenant from "../models/Tenant.js";

// const TEMP_PASSWORD = "TEMP_INVITE";

// export const inviteUser = async (req, res) => {
//   try {
//     const { email, role = "member" } = req.body;
//     const { slug } = req.params;

//     const tenant = await Tenant.findOne({ slug });
//     if (!tenant) return res.status(404).json({ message: "Tenant not found" });

//     const existingUser = await User.findOne({ email, tenant: tenant._id });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already invited/registered" });
//     }

//     const user = new User({
//       email,
//       role,
//       tenant: tenant._id,
//       password: TEMP_PASSWORD,
//     });
//     await user.save();

//     // Generate invite token (expires in 1 day)
//     const inviteToken = jwt.sign(
//       {
//         email,
//         tenantId: tenant._id,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     const inviteLink = `http://localhost:3000/accept-invite?token=${inviteToken}`;

//     res.json({
//       message: `Invitation sent to ${email}`,
//       inviteLink,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Tenant from "../models/Tenant.js";

const TEMP_PASSWORD = "TEMP_INVITE";

export const inviteUser = async (req, res) => {
  try {
    const { email, role = "member" } = req.body;
    const { slug } = req.params;

    const tenant = await Tenant.findOne({ slug });
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    const existingUser = await User.findOne({ email, tenant: tenant._id });
    if (existingUser) {
      return res.status(400).json({ message: "User already invited/registered" });
    }

    const user = new User({
      email,
      role,
      tenant: tenant._id,
      password: TEMP_PASSWORD,
    });
    await user.save();

    const inviteToken = jwt.sign(
      { email, tenantId: tenant._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const inviteLink = `http://localhost:3000/accept-invite?token=${inviteToken}`;

    res.json({
      message: `Invitation sent to ${email}`,
      inviteLink,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


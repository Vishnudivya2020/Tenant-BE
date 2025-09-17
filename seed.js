
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Tenant from "./models/Tenant.js";
import User from "./models/User.js";
import connectDB from "./mongoDBconnection.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

   
    await Promise.all([Tenant.deleteMany(), User.deleteMany()]);

   
    const [acme, globex] = await Tenant.create([
      { name: "Acme Inc", slug: "acme", plan: "free" },
      { name: "Globex Corp", slug: "globex", plan: "free" },
    ]);

    const password = process.env.SEED_PASSWORD || "password";
    const hashedPassword = await bcrypt.hash(password, 10);

   
    await User.create([
      { email: "admin@acme.test", password: hashedPassword, role: "admin", tenant: acme._id },
      { email: "user@acme.test", password: hashedPassword, role: "member", tenant: acme._id },
      { email: "admin@globex.test", password: hashedPassword, role: "admin", tenant: globex._id },
      { email: "user@globex.test", password: hashedPassword, role: "member", tenant: globex._id },
    ]);

    console.log(" Seed data inserted successfully");
  } catch (err) {
    console.error(" Seeding failed", err);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

seedData();


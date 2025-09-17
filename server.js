import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import connectDB from "./mongoDBconnection.js";

import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import inviteRoutes from  "./routes/inviteRoutes.js";


dotenv.config();
const server = express();

server.use(cors());
server.use(express.json());

//Routes
server.use("/auth", authRoutes);
server.use("/notes", noteRoutes);
server.use("/tenants", tenantRoutes);
server.use("/invites", inviteRoutes);

//Health check
server.get("/health",(req,res)=>{
    res.json({status:"ok"})
})

server.get("/",(req,res)=>{
    res.json({status:"Saas Tenant Run "})
})


const PORT = 5000;
connectDB().then(() =>{
    server.listen(PORT, () =>console.log(`Server running on port ${PORT}`))
});



import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.Mongo_URI)
            .then(() => console.log("MongoDB connected"))
            // .catch(err => console.error("MongoDB connection error:", err));

    } catch (err) {
        console.log("MongoDB connection failed:", err.message);
        process.exit(1);
    }
};
export default connectDB;
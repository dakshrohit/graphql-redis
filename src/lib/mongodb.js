import mongoose from "mongoose";
let isconnected = false;

export const connectDB = async () => {
  if (isconnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isconnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection error:", error);
    throw error;
  }
};

// Provide a default export so both default and named imports work.
export default connectDB;

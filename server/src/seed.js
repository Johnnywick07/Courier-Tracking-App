import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "./config/db.js";
import User from "./models/User.js";

const upsertUser = async (data) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) return existingUser;
  return User.create(data);
};

const run = async () => {
  try {
    await connectDB();

    const admin = await upsertUser({
      name: "Admin",
      email: "admin@courier.com",
      password: "admin123",
      role: "admin",
    });

    const rider = await upsertUser({
      name: "Rider One",
      email: "rider@courier.com",
      password: "rider123",
      role: "rider",
    });

    console.log("Seeded:", admin.email, rider.email);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();

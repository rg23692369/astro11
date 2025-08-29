import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

// Routes
import authRoutes from "./routes/auth.js";
import astrologerRoutes from "./routes/astrologers.js";
import bookingRoutes from "./routes/bookings.js";
import paymentRoutes from "./routes/payments.js";
import aiRoutes from "./routes/ai.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// CORS
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
  : ["http://localhost:5173"];

app.use(cors({ origin: allowedOrigins, credentials: true }));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "Astrotalk API" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/astrologers", astrologerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/ai", aiRoutes);

// MongoDB connection (cached for serverless)
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI/MONGODB_URI in environment variables");
  process.exit(1);
}

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, { autoIndex: true })
      .then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default app;

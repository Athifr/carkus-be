import dotenv from "dotenv";
import mongoose from "mongoose";
import { app } from "./app.js";

dotenv.config();

// Optimization untuk Serverless: Cek koneksi yang sudah ada
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
};

// Jalankan koneksi
connectDB();

// Listener hanya untuk lokal
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export default app adalah HARGA MATI untuk Vercel
export default app;
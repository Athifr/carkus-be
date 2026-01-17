import cors from "cors";
import express from "express";
import ClientError from "./commons/exceptions/ClientError.js";
import { auth } from "./routes/auth.js";
import { campus } from "./routes/campus.js";
import { users } from "./routes/users.js";

export const app = express();

// 1. Cukup satu konfigurasi CORS yang lengkap
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Menangani pre-flight request untuk semua route

app.use(express.json());

// 2. Routes
app.use("/auth", auth);
app.use("/campus", campus);
app.use("/users", users);

app.get("/", (req, res) => res.send("Server is running!"));

// 3. Error Handler
app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  console.error(err); // Pakai console.error biar lebih jelas di log
  return res.status(500).json({
    message: "internal server error",
    error: err.message // Tambahkan ini sementara untuk debug di browser
  });
});

export default app;
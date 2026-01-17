import jwt from "jsonwebtoken";
import AuthenticationError from "../commons/exceptions/AuthenticationError.js";
import ConflictError from "../commons/exceptions/ConflictError.js";
import NotFoundError from "../commons/exceptions/NotFoundError.js";
import { User } from "../models/User.js";
import { createHash } from "../utils/hash.js";

/** @type{import("express").RequestHandler} */
export async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    
   if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return; // Cukup tulis return tanpa mengembalikan objek res
    }

    const passwordHash = createHash(password);
    const user = await User.findOne({ username });
    if (!user) {
      throw new NotFoundError("Username not found");
    }
    if (user.password !== passwordHash) {
      throw new AuthenticationError("Invalid password");
    }
    const userId = user._id;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ userId, token });
  } catch (err) {
    console.error("DEBUG LOGIN ERROR:", err); // Ini akan muncul di Vercel Logs
    // Tambahkan res.status sementara jika next(err) tidak memberikan info
    res.status(500).json({ error: err.message, stack: err.stack }); 
    // next(err); // Matikan dulu sementara biar info error keluar ke browser
}
}

/** @type{import("express").RequestHandler} */
export async function register(req, res, next) {
  try {
    const { username, password } = req.body;
    const checkUser = await User.findOne({ username });
    if (checkUser) {
      throw new ConflictError("Username already exists");
    }
    const passwordHash = createHash(password);
    const user = await User.create({
      username,
      password: passwordHash,
    });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

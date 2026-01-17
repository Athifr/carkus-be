import jwt from "jsonwebtoken";
import AuthenticationError from "../commons/exceptions/AuthenticationError.js";
import { User } from "../models/User.js";

/** @type{import("express").RequestHandler} */
export async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new AuthenticationError("Unauthenticated");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded === "object" && typeof decoded.userId === "string") {
      const user = await User.findById(decoded.userId);
      if (user) {
        res.locals.token = decoded;
        return next();
      }
    }
    throw new AuthenticationError("Invalid token");
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new AuthenticationError("Invalid token"));
    }
    next(err);
  }
}

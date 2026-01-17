import NotFoundError from "../commons/exceptions/NotFoundError.js";
import { User } from "../models/User.js";

/** @type {import("express").RequestHandler} */
export async function getUsers(req, res, next) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

/** @type {import("express").RequestHandler} */
export async function getUserById(req, res, next) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

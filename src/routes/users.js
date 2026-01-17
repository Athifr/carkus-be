import { Router } from "express";
import { getUserById, getUsers } from "../controllers/user.js";

export const users = Router();

users.get("/", getUsers);

users.get("/:userId", getUserById);

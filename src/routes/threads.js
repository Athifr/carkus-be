import { Router } from "express";
import {
  addThread,
  deleteThreadById,
  getThreadById,
  getThreads,
  updateThreadById,
} from "../controllers/thread.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { comments } from "./comments.js";

export const threads = Router({ mergeParams: true });

threads
  .get("/", getThreads)
  .get("/:threadId", getThreadById)

  .post("/", authMiddleware, addThread)
  .put("/:threadId", authMiddleware, updateThreadById)
  .delete("/:threadId", authMiddleware, deleteThreadById)

  .use("/:threadId/comments", comments);

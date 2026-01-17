import { Router } from "express";
import {
  addComment,
  deleteCommentById,
  getCommentById,
  getComments,
  updateCommentById,
} from "../controllers/comment.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const comments = Router({ mergeParams: true });

comments
  .get("/", getComments)
  .get("/:commentId", getCommentById)

  .post("/", authMiddleware, addComment)
  .put("/:commentId", authMiddleware, updateCommentById)
  .delete("/:commentId", authMiddleware, deleteCommentById);

import AuthorizationError from "../commons/exceptions/AuthorizationError.js";
import NotFoundError from "../commons/exceptions/NotFoundError.js";
import { Campus } from "../models/Campus.js";

/** @type {import("express").RequestHandler} */
export async function getComments(req, res, next) {
  try {
    const { campusId, threadId } = req.params;

    const campus = await Campus.findById(campusId);
    if (!campus) {
      throw new NotFoundError("Campus not found");
    }

    const thread = campus.threads.id(threadId);
    if (!thread) {
      throw new NotFoundError("Thread not found");
    }

    res.status(200).json(thread.comments);
  } catch (err) {
    next(err);
  }
}

/** @type {import("express").RequestHandler} */
export async function getCommentById(req, res, next) {
  try {
    const { campusId, threadId, commentId } = req.params;

    const campus = await Campus.findById(campusId);
    if (!campus) {
      throw new NotFoundError("Campus not found");
    }

    const thread = campus.threads.id(threadId);
    if (!thread) {
      throw new NotFoundError("Thread not found");
    }

    const comment = thread.comments.id(commentId);
    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    res.status(200).json(comment);
  } catch (err) {
    next(err);
  }
}

/** @type {import("express").RequestHandler} */
export async function addComment(req, res, next) {
  try {
    const { userId } = res.locals.token;
    const { campusId, threadId } = req.params;
    const { content } = req.body;

    const campus = await Campus.findById(campusId);
    if (!campus) {
      throw new NotFoundError("Campus not found");
    }

    const thread = campus.threads.id(threadId);
    if (!thread) {
      throw new NotFoundError("Thread not found");
    }

    thread.comments.push({
      author: userId,
      content,
    });
    await campus.save();
    res.status(201).json(thread.comments.at(-1));
  } catch (err) {
    next(err);
  }
}

/** @type {import("express").RequestHandler} */
export async function updateCommentById(req, res, next) {
  try {
    const { userId } = res.locals.token;
    const { campusId, threadId, commentId } = req.params;
    const { content } = req.body;

    const campus = await Campus.findById(campusId);
    if (!campus) {
      throw new NotFoundError("Campus not found");
    }

    const thread = campus.threads.id(threadId);
    if (!thread) {
      throw new NotFoundError("Thread not found");
    }

    const comment = thread.comments.id(commentId);
    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    if (comment.author.toString() !== userId) {
      throw new AuthorizationError("Restricted resource");
    }

    comment.content = content;
    await campus.save();
    res.status(200).json({
      message: "success",
    });
  } catch (err) {
    next(err);
  }
}

/** @type {import("express").RequestHandler} */
export async function deleteCommentById(req, res, next) {
  try {
    const { userId } = res.locals.token;
    const { campusId, threadId, commentId } = req.params;

    const campus = await Campus.findById(campusId);
    if (!campus) {
      throw new NotFoundError("Campus not found");
    }

    const thread = campus.threads.id(threadId);
    if (!thread) {
      throw new NotFoundError("Thread not found");
    }

    const comment = thread.comments.id(commentId);
    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    if (thread.author.toString() !== userId) {
      throw new AuthorizationError("Restricted resource");
    }

    comment.remove();
    await campus.save();
    res.status(200).json({
      message: "success",
    });
  } catch (err) {
    next(err);
  }
}

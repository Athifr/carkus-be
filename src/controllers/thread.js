import AuthorizationError from "../commons/exceptions/AuthorizationError.js";
import NotFoundError from "../commons/exceptions/NotFoundError.js";
import { Campus } from "../models/Campus.js";

/** @type {import("express").RequestHandler} */
export async function addThread(req, res, next) {
  try {
    const { userId } = res.locals.token;
    const { title, content } = req.body;
    const { campusId } = req.params;

    const campus = await Campus.findById(campusId);
    if (!campus) {
      throw new NotFoundError("Campus not found");
    }

    campus.threads.unshift({
      author: userId,
      title,
      content,
    });
    await campus.save();

    res.status(201).json(campus.threads.at(-1));
  } catch (err) {
    next(err);
  }
}

/** @type {import("express").RequestHandler} */
export async function getThreads(req, res, next) {
  try {
    const { campusId } = req.params;
    const campus = await Campus.findById(campusId);
    if (!campus) {
      throw new NotFoundError("Campus not found");
    }

    res.status(200).json(campus.threads);
  } catch (err) {
    next(err);
  }
}

/** @type {import("express").RequestHandler} */
export async function getThreadById(req, res, next) {
  try {
    const { campusId, threadId } = req.params;
    const campus = await Campus.findById(campusId);
    if (!campus) {
      throw new NotFoundError("Campus not found");
    }

    const thread = campus.threads.id(threadId);
    if (!thread) {
      throw new NotFoundError("Comment not found");
    }

    res.status(200).json(thread);
  } catch (err) {
    next(err);
  }
}

/** @type {import("express").RequestHandler} */
export async function updateThreadById(req, res, next) {
  try {
    const { userId } = res.locals.token;
    const { campusId, threadId } = req.params;
    const { title, content } = req.body;

    const campus = await Campus.findById(campusId);
    if (!campus) {
      throw new NotFoundError("Campus not found");
    }

    const thread = campus.threads.id(threadId);
    if (!thread) {
      throw new NotFoundError("Thread not found");
    }

    if (thread.author.toString() !== userId) {
      throw new AuthorizationError("Restricted resource");
    }

    thread.title = title;
    thread.content = content;
    await campus.save();
    res.status(200).json({
      message: "success",
    });
  } catch (err) {
    next(err);
  }
}

/** @type {import("express").RequestHandler} */
export async function deleteThreadById(req, res, next) {
  try {
    const { userId } = res.locals.token;
    const { campusId, threadId } = req.params;

    const campus = await Campus.findById(campusId);
    if (!campus) {
      throw new NotFoundError("Campus not found");
    }

    const thread = campus.threads.id(threadId);
    if (!thread) {
      throw new NotFoundError("Thread not found");
    }

    if (thread.author.toString() !== userId) {
      throw new AuthorizationError("Restricted resource");
    }

    thread.remove();
    await campus.save();
    res.status(200).json({
      message: "success",
    });
  } catch (err) {
    next(err);
  }
}

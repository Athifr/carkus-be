import AuthorizationError from "../commons/exceptions/AuthorizationError.js";
import NotFoundError from "../commons/exceptions/NotFoundError.js";
import { Campus } from "../models/Campus.js";

/** @type {import("express").RequestHandler} */
export async function getCampuses(req, res, next) {
  try {
    const campuses = await Campus.find();
    res.status(200).json(campuses);
  } catch (err) {
    next(err);
  }
}

/** @type{import("express").RequestHandler} */
export async function getCampusById(req, res, next) {
  try {
    const { campusId } = req.params;
    const campus = await Campus.findById(campusId);
    if (!campus) {
      throw new NotFoundError("campus not found");
    }
    res.status(200).json(campus);
  } catch (err) {
    next(err);
  }
}

/** @type{import("express").RequestHandler} */
export async function addCampus(req, res, next) {
  try {
    const { userId } = res.locals.token;
    const {
      name,
      address,
      description,
      accreditation,
      status,
      faculties,
      links,
      imageUrl,
    } = req.body;
    const campus = await Campus.create({
      name,
      address,
      description,
      accreditation,
      status,
      faculties,
      links,
      imageUrl,
      admin: userId,
    });
    res.status(201).json(campus);
  } catch (err) {
    next(err);
  }
}

/** @type{import("express").RequestHandler} */
export async function updateCampus(req, res, next) {
  try {
    const { userId } = res.locals.token;
    const { campusId } = req.params;
    const {
      name,
      address,
      description,
      accreditation,
      status,
      faculties,
      links,
      imageUrl,
    } = req.body;
    const campus = await Campus.findById(campusId);
    if (!campus) {
      throw new NotFoundError("Campus not found");
    }
    if (campus.admin.toString() !== userId) {
      throw new AuthorizationError("Restricted resource");
    }
    await campus.updateOne({
      name,
      address,
      description,
      accreditation,
      status,
      faculties,
      links,
      imageUrl,
    });
    res.status(200).json({ message: "success" });
  } catch (err) {
    next(err);
  }
}

/** @type{import("express").RequestHandler} */
export async function deleteCampus(req, res, next) {
  try {
    const { userId } = res.locals.token;
    const { campusId } = req.params;
    const campus = await Campus.findById(campusId);
    if (!campus) {
      throw new NotFoundError("Campus not found");
    }
    if (campus.admin.toString() !== userId) {
      throw new AuthorizationError("Restricted resource");
    }
    await campus.deleteOne();
    res.status(200).json(campus);
  } catch (err) {
    next(err);
  }
}

import { Router } from "express";
import {
  addCampus,
  deleteCampus,
  getCampusById,
  getCampuses,
  updateCampus,
} from "../controllers/campus.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { threads } from "./threads.js";

export const campus = Router();

campus
  .get("/", getCampuses)
  .get("/:campusId", getCampusById)

  .post("/", authMiddleware, addCampus)
  .put("/:campusId", authMiddleware, updateCampus)
  .delete("/:campusId", authMiddleware, deleteCampus)

  .use("/:campusId/threads", threads);

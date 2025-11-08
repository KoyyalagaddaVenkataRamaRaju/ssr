import express from "express";
import { getStudentFees } from "../controllers/studentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/fees/:studentId", protect, getStudentFees);

export default router;

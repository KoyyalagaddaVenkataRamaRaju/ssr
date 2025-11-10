import express from "express";
import {
  createFee,
  getAllFees,
  getFeeById,
  updateFee,
  deleteFee,
  applyDiscount,
  markFeePaid,
} from "../controllers/feeController.js";

import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// Only admin can manage fees
router.route("/")
  .get(protect, admin, getAllFees)
  .post(protect, admin, createFee);

router.route("/:id")
  .get(protect, admin, getFeeById)
  .put(protect, admin, updateFee)
  .delete(protect, admin, deleteFee);

// Apply discount to a student
router.patch("/:feeId/discount/:studentId", protect, admin, applyDiscount);

// Mark fee as paid
router.patch("/:feeId/pay/:studentId", protect, admin, markFeePaid);

export default router;

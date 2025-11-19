import express from 'express';
import {
  createFee,
  getAllFees,
  deleteFee,
  getStudentFees,
  updateStudentFee,
  applyDiscount
} from '../controllers/feeController.js';

import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Create fee for branch + assign to students
router.post('/create', protect, authorize('admin'), createFee);

// Get all fees
router.get('/all', protect, getAllFees);

// Delete a fee
router.delete('/:id', protect, authorize('admin'), deleteFee);

// Get all student fees with search/filter
router.get('/students', protect, getStudentFees);

// Update student fee
router.put('/student/:id', protect, authorize('admin'), updateStudentFee);

// Apply discount
router.patch('/student/:id/discount', protect, authorize('admin'), applyDiscount);

export default router;

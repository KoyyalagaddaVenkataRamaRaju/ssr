import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import { createBatch, getAllBatches,getDepartmentById } from '../controllers/batchController.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, createBatch)  // create a batch
  .get(protect, admin, getAllBatches); // get all batches
router.route("/department").get( protect,admin,getDepartmentById)
export default router;

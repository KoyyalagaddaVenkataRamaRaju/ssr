import express from 'express';
import { protect, admin, teacher } from '../middleware/auth.js';
import { createBatch, getAllBatches,getDepartmentById,getBatchById } from '../controllers/batchController.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, createBatch)  // create a batch
  .get(protect, admin, getAllBatches);
   
router.route('/all').get(protect, teacher, getAllBatches);// get all batches
router.route("/department").get( protect,admin,getDepartmentById)
router.route("/:batchId").get(protect,teacher,getBatchById)
export default router;

import express from 'express';
const router = express.Router();
import {
  adminRegisterDepartment,
  getAllDepartments,
  getDepartmentById,
  createBatch,
  getAllBatchesByDepartmentId,
} from '../controllers/departmentController.js';
import { protect, admin } from '../middleware/auth.js';
router.route('/register').post(protect, admin,adminRegisterDepartment);
router.route('/').get(getAllDepartments).post(protect, admin, adminRegisterDepartment); // Modified route
router.route('/:id').get(getDepartmentById);
router.route('/:id/batches').post(protect, admin, createBatch).get(getAllBatchesByDepartmentId);

export default router;
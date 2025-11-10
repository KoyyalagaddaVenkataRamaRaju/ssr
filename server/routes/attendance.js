import express from 'express';
import {
  createAttendance,
  getAllAttendance,
  getStudentAttendance,
  getBatchAttendanceReport,
  getAttendanceById,
  updateAttendance
} from '../controllers/attendanceController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, admin, createAttendance);
router.get('/', protect, getAllAttendance);
router.get('/student/:studentId', protect, getStudentAttendance);
router.get('/report/batch/:batchId/section/:section', protect, admin, getBatchAttendanceReport);
router.get('/:id', protect, getAttendanceById);
router.put('/:id', protect,  admin, updateAttendance);

export default router;

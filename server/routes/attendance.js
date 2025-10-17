import express from 'express';
import {
  createAttendance,
  getAllAttendance,
  getStudentAttendance,
  getBatchAttendanceReport,
  getAttendanceById,
  updateAttendance
} from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('teacher', 'admin'), createAttendance);
router.get('/', protect, getAllAttendance);
router.get('/student/:studentId', protect, getStudentAttendance);
router.get('/report/batch/:batchId/section/:section', protect, authorize('teacher', 'admin'), getBatchAttendanceReport);
router.get('/:id', protect, getAttendanceById);
router.put('/:id', protect, authorize('teacher', 'admin'), updateAttendance);

export default router;

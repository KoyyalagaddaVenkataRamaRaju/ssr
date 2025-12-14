import express from 'express';
import {
  createSemester,
  getAllSemesters,
  getCurrentSemester,
  getSemesterById,
  updateSemester,
  setCurrentSemester,
  deleteSemester
} from '../controllers/semesterController.js';
import { protect,admin, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, admin, createSemester);
router.get('/', protect,admin, getAllSemesters);
router.get('/current/:department', protect, getCurrentSemester);
router.get('/:id', protect, getSemesterById);
router.put('/:id', protect, admin, updateSemester);
router.put('/:id/set-current', protect, admin, setCurrentSemester);
router.delete('/:id', protect, admin, deleteSemester);

export default router;

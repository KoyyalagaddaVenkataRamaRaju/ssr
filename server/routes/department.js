import express from 'express';
const router = express.Router();
import { adminRegisterDepartment ,getAllDepartments} from '../controllers/departmentController.js';
import { protect, admin } from '../middleware/auth.js';

router.route('/register').post(protect, admin,adminRegisterDepartment);
router.get('/', getAllDepartments);
export default router;
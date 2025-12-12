import express from 'express';
const router = express.Router();
import { createApplication,getAllApplications,getApplicationById,getApplicationBySummary,updateOfficeUseOnly }  from '../controllers/applicationController.js';
import { protect,teacher } from '../middleware/auth.js';

router.post('/',protect,teacher, createApplication);
router.get('/',protect,teacher, getAllApplications);
router.get('/:id',protect,teacher, getApplicationById);
router.get('/summary/:applicationId', protect,teacher,getApplicationBySummary);
router.post('/office-use/:applicationId', protect,teacher,updateOfficeUseOnly);

export default router;
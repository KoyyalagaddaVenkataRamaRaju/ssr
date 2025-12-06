import express from 'express';
const router = express.Router();
import { createApplication,getAllApplications,getApplicationById,getApplicationBySummary,updateOfficeUseOnly }  from '../controllers/applicationController.js';

router.post('/', createApplication);
router.get('/', getAllApplications);
router.get('/:id', getApplicationById);
router.get('/summary/:applicationId', getApplicationBySummary);
router.post('/office-use/:applicationId', updateOfficeUseOnly);

export default router;
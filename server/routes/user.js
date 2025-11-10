import express from 'express';
import { getProfile, updateProfile, getUsers } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
// List users (supports query params: role, batch, section, department, search, limit, page)
router.get('/', protect, getUsers);

export default router;

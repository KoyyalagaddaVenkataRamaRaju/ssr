import express from 'express';
import pkg from 'uuid';
const { v4: uuidv4 } = pkg;
import Fee from '../models/Fee.js';
import Department from '../models/Departement.js';
import Batch from '../models/Batch.js';
import Semester from '../models/Semester.js';

const router = express.Router();

// ✅ Create new fee assignment
router.post('/', async (req, res) => {
  try {
    const { department, batch, semester, amount, description } = req.body;

    // Basic validation
    if (!department || !batch || !semester || !amount) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    // Check if IDs exist in their collections
    const deptExists = await Department.findById(department);
    const batchExists = await Batch.findById(batch);
    const semExists = await Semester.findById(semester);

    if (!deptExists || !batchExists || !semExists) {
      return res.status(400).json({ success: false, message: 'Invalid department, batch, or semester ID' });
    }

    const fee = await Fee.create({
      feeId: uuidv4(),
      department,
      batch,
      semester,
      amount,
      description,
    });

    // Populate references before sending response
    const populatedFee = await Fee.findById(fee._id)
      .populate('department')
      .populate('batch')
      .populate('semester');

    res.status(201).json({ success: true, fee: populatedFee });
  } catch (error) {
    console.error('Error creating fee:', error);
    res.status(500).json({ success: false, message: 'Error creating fee' });
  }
});

// ✅ Get all fees
router.get('/', async (req, res) => {
  try {
    const fees = await Fee.find()
      .sort({ createdAt: -1 })
      .populate('department')
      .populate('batch')
      .populate('semester');

    res.json({ success: true, fees });
  } catch (error) {
    console.error('Error fetching fees:', error);
    res.status(500).json({ success: false, message: 'Error fetching fees' });
  }
});

export default router;

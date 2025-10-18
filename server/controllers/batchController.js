import Batch from '../models/Batch.js';
import Department from '../models/Departement.js';

// ===================== CREATE BATCH =====================
export const createBatch = async (req, res) => {
  try {
    const { batchName, departments } = req.body;

    if (!batchName || !departments || !Array.isArray(departments) || departments.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Batch name and at least one department are required.',
      });
    }

    const deptIds = departments.map((d) => d.departmentId);
    const validDepartments = await Department.find({ _id: { $in: deptIds } });

    if (validDepartments.length !== departments.length) {
      return res.status(404).json({
        success: false,
        message: 'One or more provided departments were not found.',
      });
    }

    const departmentsForBatch = departments.map((d) => {
      const dept = validDepartments.find((v) => v._id.toString() === d.departmentId);
      return {
        departmentId: dept._id,
        departmentName: dept.departmentName,
        numberOfSections: d.numberOfSections,
      };
    });

    let startDate = null, endDate = null;
    if (batchName.includes('-')) {
      const [startYear, endYear] = batchName.split('-').map(Number);
      startDate = new Date(startYear, 0, 1);
      endDate = new Date(endYear, 11, 31);
    }

    const batch = await Batch.create({
      batchName,
      departments: departmentsForBatch,
      startDate,
      endDate,
    });

    await Department.updateMany(
      { _id: { $in: deptIds } },
      { $push: { batches: batch._id } }
    );

    return res.status(201).json({
      success: true,
      message: 'Batch created successfully',
      data: batch,
    });
  } catch (error) {
    console.error('Error creating batch:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// ===================== GET ALL BATCHES =====================
export const getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find().populate('departments.departmentId', 'departmentName');
    return res.status(200).json({
      success: true,
      data: batches,
    });
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// ===================== GET SINGLE BATCH BY ID =====================
export const getBatchById = async (req, res) => {
  try {
    
    const { batchId } = req.params; // <-- use route param
    console.log(batchId)
    const id=batchId;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Batch ID is required' });
    }

    const batch = await Batch.findById(id).populate('departments.departmentId', 'departmentName departmentImage');
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: batch,
    });
  } catch (error) {
    console.error('Error fetching batch by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// ===================== GET DEPARTMENTS UNDER A BATCH =====================
export const getDepartmentsByBatch = async (req, res) => {
  try {
    const { batchId } = req.query;

    if (!batchId) {
      return res.status(400).json({
        success: false,
        message: 'batchId is required as a query parameter',
      });
    }

    const batch = await Batch.findById(batchId).populate('departments.departmentId', 'departmentName departmentImage');
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    const departments = batch.departments.map((d) => ({
      _id: d.departmentId._id,
      departmentName: d.departmentId.departmentName,
      departmentImage: d.departmentId.departmentImage,
      numberOfSections: d.numberOfSections,
    }));

    return res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    console.error('Error fetching departments by batch:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// ===================== GET DEPARTMENT BY ID =====================
export const getDepartmentById = async (req, res) => {
  try {
    const { departmentId } = req.query;
    if (!departmentId) {
      return res.status(400).json({ success: false, message: 'Department ID is required' });
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.status(200).json({ success: true, data: department });
  } catch (error) {
    console.error('Error fetching department by ID:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

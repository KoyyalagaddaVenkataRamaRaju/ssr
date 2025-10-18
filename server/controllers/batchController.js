import Batch from '../models/Batch.js';
import Department from '../models/Departement.js';

// Create batch with departmentName stored
export const createBatch = async (req, res) => {
  try {
    const { batchName, departments } = req.body;

    if (!departments || !Array.isArray(departments) || departments.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide at least one department' });
    }

    // Extract department IDs
    const deptIds = departments.map(d => d.departmentId);

    // Fetch department details
    const validDepartments = await Department.find({ _id: { $in: deptIds } });

    if (validDepartments.length !== departments.length) {
      return res.status(404).json({ success: false, message: 'One or more departments not found' });
    }

    // Map to schema format with departmentName
    const departmentsForBatch = departments.map(d => {
      const dept = validDepartments.find(v => v._id.toString() === d.departmentId);
      return {
        departmentId: dept._id,
        departmentName: dept.departmentName,
        numberOfSections: d.numberOfSections
      };
    });

    // Calculate startDate and endDate from batchName
    const [startYear, endYear] = batchName.split('-').map(Number);
    const startDate = new Date(startYear, 0, 1);
    const endDate = new Date(endYear, 11, 31);

    // Create batch
    const batch = await Batch.create({
      batchName,
      departments: departmentsForBatch,
      startDate,
      endDate
    });

    // Add batch reference to each department
    await Department.updateMany(
      { _id: { $in: deptIds } },
      { $push: { batches: batch._id } }
    );

    res.status(201).json({ success: true, message: 'Batch created successfully', data: batch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get all batches
export const getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find();
    res.status(200).json({ success: true, data: batches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


export const getDepartmentById = async (req, res) => {
  try {
    
    const { departmentId } = req.query;
    console.log("Backend",departmentId)
    if (!departmentId) {
      return res.status(400).json({
        success: false,
        message: "departmentId is required in query parameter",
      });
    }

    // Find the batch containing this department
    const batch = await Batch.find(
      { "departments.departmentId": departmentId },
      { "departments.$": 1, batchName: 1 } // return only the matching department and batch name
    );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    res.status(200).json({
      success: true,
      data: batch,
    });
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
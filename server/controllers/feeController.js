import Fee from "../models/Fee.js";
import User from "../models/User.js";
import Batch from "../models/Batch.js";

/**
 * @desc Create new fee
 * @route POST /api/fees
 */
export const createFee = async (req, res) => {
  try {
    const {
      batch,
      department,
      semester,
      academicYear,
      feeName,
      totalAmount,
      breakdown,
    } = req.body;

    // Get all students in this department & batch
    const students = await User.find({
      role: "student",
      department,
      batch,
      isActive: true,
    }).select("_id");

    const assigned = students.map((s) => ({
      student: s._id,
      amountAfterDiscount: totalAmount,
    }));

    const fee = await Fee.create({
      batch,
      department,
      semester,
      academicYear,
      feeName,
      totalAmount,
      breakdown,
      createdBy: req.user?._id, // from middleware
      assignedToStudents: assigned,
    });

    res.status(201).json({ success: true, fee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create fee", error });
  }
};

/**
 * @desc Get all fees
 * @route GET /api/fees
 */
export const getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find()
      .populate("batch", "batchName")
      .populate("department", "departmentName")
      .populate("semester", "semesterName semesterNumber")
      .populate("createdBy", "name email");

    res.json({ success: true, fees });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch fees" });
  }
};

/**
 * @desc Get single fee with students
 * @route GET /api/fees/:id
 */
export const getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id)
      .populate({
        path: "assignedToStudents.student",
        select: "name email enrollmentId",
      })
      .populate("batch department semester");

    if (!fee)
      return res.status(404).json({ success: false, message: "Fee not found" });

    res.json({ success: true, fee });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching fee" });
  }
};

/**
 * @desc Update fee details
 * @route PUT /api/fees/:id
 */
export const updateFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!fee)
      return res.status(404).json({ success: false, message: "Fee not found" });
    res.json({ success: true, fee });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating fee" });
  }
};

/**
 * @desc Delete fee
 * @route DELETE /api/fees/:id
 */
export const deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee)
      return res.status(404).json({ success: false, message: "Fee not found" });

    await fee.deleteOne();
    res.json({ success: true, message: "Fee deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting fee" });
  }
};

/**
 * @desc Apply discount to student
 * @route PATCH /api/fees/:feeId/discount/:studentId
 */
export const applyDiscount = async (req, res) => {
  try {
    const { feeId, studentId } = req.params;
    const { discount } = req.body;

    const fee = await Fee.findById(feeId);
    if (!fee) return res.status(404).json({ message: "Fee not found" });

    const studentEntry = fee.assignedToStudents.find(
      (s) => s.student.toString() === studentId
    );

    if (!studentEntry)
      return res.status(404).json({ message: "Student not found in fee" });

    studentEntry.discount = discount;
    studentEntry.amountAfterDiscount = fee.totalAmount - discount;
    await fee.save();

    res.json({ success: true, message: "Discount applied", fee });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error applying discount" });
  }
};

/**
 * @desc Mark student fee as paid
 * @route PATCH /api/fees/:feeId/pay/:studentId
 */
export const markFeePaid = async (req, res) => {
  try {
    const { feeId, studentId } = req.params;
    const { paymentMode, transactionId } = req.body;

    const fee = await Fee.findById(feeId);
    if (!fee) return res.status(404).json({ message: "Fee not found" });

    const studentEntry = fee.assignedToStudents.find(
      (s) => s.student.toString() === studentId
    );
    if (!studentEntry)
      return res.status(404).json({ message: "Student not found in fee" });

    studentEntry.isPaid = true;
    studentEntry.paymentMode = paymentMode;
    studentEntry.paymentDate = new Date();
    studentEntry.transactionId = transactionId;

    await fee.save();

    res.json({ success: true, message: "Payment marked successfully", fee });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating payment" });
  }
};

import Fee from "../models/Fee.js";
import User from "../models/User.js";

// ✅ Fetch fees for a student’s batch & department
export const getFeesForStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Find the student’s batch and department
    const student = await User.findById(studentId).select("batch department role");
    if (!student || student.role !== "student") {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Find all fees for this student's batch and department
    const fees = await Fee.find({
      batch: student.batch,
      department: student.department,
      isPublished: true, // only published ones are visible to students
    })
      .populate("batch", "batchName")
      .populate("department", "departmentName")
      .populate("semester", "semesterName semesterNumber")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: fees.length, fees });
  } catch (error) {
    console.error("Error fetching student fees:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching student fees",
      error: error.message,
    });
  }
};

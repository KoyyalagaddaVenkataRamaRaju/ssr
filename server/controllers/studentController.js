import Fee from "../models/Fee.js";

export const getStudentFees = async (req, res) => {
  try {
    const { studentId } = req.params;
    const fees = await Fee.find({
      "assignedToStudents.student": studentId,
    })
      .populate("batch department semester")
      .lean();

    // Extract only relevant student details
    const studentFees = fees.map((fee) => {
      const studentFee = fee.assignedToStudents.find(
        (s) => s.student.toString() === studentId
      );
      return {
        _id: fee._id,
        feeName: fee.feeName,
        batch: fee.batch,
        department: fee.department,
        semester: fee.semester,
        academicYear: fee.academicYear,
        totalAmount: fee.totalAmount,
        discount: studentFee?.discount || 0,
        amountAfterDiscount:
          studentFee?.amountAfterDiscount || fee.totalAmount,
        isPaid: studentFee?.isPaid || false,
        paymentMode: studentFee?.paymentMode,
        paymentDate: studentFee?.paymentDate,
      };
    });

    res.json({ success: true, fees: studentFees });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching student fees" });
  }
};

import mongoose from "mongoose";

const assignedStudentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paymentDate: Date,
  paymentMode: {
    type: String,
    enum: ["cash", "online", "upi", "card", "bank"],
  },
  transactionId: String,
  discount: {
    type: Number,
    default: 0,
  },
  amountAfterDiscount: {
    type: Number,
  },
});

const feeSchema = new mongoose.Schema(
  {
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{4}-\d{4}$/, "Academic year must be in format YYYY-YYYY"],
    },
    feeName: {
      type: String,
      required: true,
      trim: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    breakdown: [
      {
        title: { type: String },
        amount: { type: Number },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedToStudents: [assignedStudentSchema],
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevent duplicate fee for same combination
feeSchema.index(
  { batch: 1, department: 1, semester: 1, academicYear: 1 },
  { unique: true }
);

const Fee = mongoose.model("Fee", feeSchema);
export default Fee;

import mongoose from 'mongoose';

const DepartementSchema = new mongoose.Schema(
  {
    departmentName: {
      type: String,
      required: [true, 'Please provide a Department name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    departmentId: {
      type: String,
      trim: true,
    },
    departmentImage: {
      type: String, // Changed from File to String
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Department = mongoose.model('Departments', DepartementSchema);

export default Department;
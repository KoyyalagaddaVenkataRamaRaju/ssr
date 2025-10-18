import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    departmentName: {
      type: String,
      required: [true, 'Please add a department name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters'],
    },
    departmentId: {
      type: String,
      required: [true, 'Please add a department ID'],
      unique: true,
      trim: true,
    },
    departmentImage: {
      type: String,
      required: [true, 'Please add a department image'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description can not be more than 500 characters'],
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    batches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
      },
    ],
  },
  { timestamps: true }
);

const Department = mongoose.model('Department', departmentSchema);
export default Department;

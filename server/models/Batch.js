import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema(
  {
    batchName: { type: String, required: true, trim: true, maxlength: 50 },

    // Branch-wise departments with names
    departments: [
      {
        departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
        departmentName: { type: String, required: true },
        numberOfSections: { type: Number, required: true, min: 1 }
      }
    ],

    startDate: { type: Date },
    endDate: { type: Date }
  },
  { timestamps: true }
);

const Batch = mongoose.model('Batch', batchSchema);
export default Batch;

import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema(
  {
    batchName: {
      type: String,
      required: [true, 'Please add a batch name'],
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters'],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    numberOfSections: {
      type: Number,
      required: [true, 'Please add the number of sections'],
      min: 1,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Batch = mongoose.model('Batch', batchSchema);

export default Batch;
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    binId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bin',
      required: false,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: false,
    },
    category: {
      type: String,
      enum: ['technical', 'driver_behavior', 'bin_damage', 'overflowing_bin', 'missed_collection', 'other'],
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: [Number],
    },
    attachments: [
      {
        url: String,
        type: String, // 'image' or 'video'
        uploadedAt: Date,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'acknowledged', 'in_progress', 'assigned', 'resolved', 'closed'],
      default: 'pending',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    adminNotes: [
      {
        note: String,
        addedBy: mongoose.Schema.Types.ObjectId,
        addedAt: Date,
      },
    ],
    resolvedAt: {
      type: Date,
      required: false,
    },
  },
  { 
    timestamps: true,
  }
);

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;

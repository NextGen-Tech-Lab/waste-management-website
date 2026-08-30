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
        type: {
          type: String,
          enum: ['image'],
          default: 'image',
        },
        name: String,
        size: Number,
        uploadedAt: Date,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'fixed'],
      default: 'pending',
    },
    decisionReason: {
      type: String,
      required: false,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['pending', 'accepted', 'rejected', 'fixed'],
          required: true,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: false,
        },
        note: {
          type: String,
          required: false,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
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

complaintSchema.pre('save', function addInitialHistory(next) {
  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    this.statusHistory = [
      {
        status: this.status,
        changedBy: this.userId,
        note: 'Complaint submitted by user',
        changedAt: new Date(),
      },
    ];
  }
  next();
});

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;

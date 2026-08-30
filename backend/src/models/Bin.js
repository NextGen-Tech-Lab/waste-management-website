import mongoose from 'mongoose';

const binSchema = new mongoose.Schema(
  {
    binId: {
      type: String,
      unique: true,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipcode: String,
    },
    wasteType: {
      type: String,
      enum: ['organic', 'plastic', 'mixed', 'hazardous', 'recyclable'],
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      default: 100, // in liters
    },
    currentFillLevel: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastCollectedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'full', 'maintenance'],
      default: 'active',
    },
    installationDate: {
      type: Date,
      default: Date.now,
    },
    maintenanceHistory: [
      {
        date: Date,
        description: String,
        performedBy: mongoose.Schema.Types.ObjectId,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create geospatial index
binSchema.index({ 'location': '2dsphere' });

const Bin = mongoose.model('Bin', binSchema);
export default Bin;

import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      unique: true,
      required: true,
    },
    registrationNumber: {
      type: String,
      unique: true,
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: false,
    },
    driverName: {
      type: String,
      required: true,
    },
    driverContact: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      enum: ['compactor', 'tipper', 'open_bed'],
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      default: 1000, // in liters
    },
    currentLoad: {
      type: Number,
      default: 0,
    },
    currentLocation: {
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
    currentRoute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'offline', 'on_break', 'in_maintenance'],
      default: 'offline',
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    totalCollections: {
      type: Number,
      default: 0,
    },
    totalDistance: {
      type: Number,
      default: 0, // in km
    },
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
vehicleSchema.index({ 'currentLocation': '2dsphere' });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;

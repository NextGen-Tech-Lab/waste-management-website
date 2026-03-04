import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema(
  {
    routeId: {
      type: String,
      unique: true,
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: false,
    },
    routePath: [
      {
        latitude: Number,
        longitude: Number,
        sequence: Number,
      },
    ],
    stops: [
      {
        binId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Bin',
        },
        latitude: Number,
        longitude: Number,
        sequence: Number,
        arrivedAt: Date,
        departedAt: Date,
        wasterCollected: Number, // in liters
        status: {
          type: String,
          enum: ['pending', 'reached', 'completed', 'skipped'],
          default: 'pending',
        },
      },
    ],
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: false,
    },
    distance: {
      type: Number,
      default: 0, // in km
    },
    wasteCollected: {
      type: Number,
      default: 0, // in liters
    },
    status: {
      type: String,
      enum: ['planned', 'in_progress', 'completed', 'cancelled'],
      default: 'planned',
    },
    notes: String,
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

const Route = mongoose.model('Route', routeSchema);
export default Route;

import { Server } from 'socket.io';
import Vehicle from '../models/Vehicle.js';
import Complaint from '../models/Complaint.js';
import Bin from '../models/Bin.js';

let connectedUsers = new Map();
let vehicleSubscribers = new Map(); // Track which clients are subscribed to vehicle updates

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.SOCKET_IO_CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`New user connected: ${socket.id}`);

    // Store user connection
    socket.on('userLogin', (userId) => {
      connectedUsers.set(socket.id, userId);
      socket.join(`user-${userId}`);
      console.log(`User ${userId} logged in`);
    });

    /**
     * Vehicle location update from driver
     * Emits: vehicleLocationUpdated to all tracking clients
     */
    socket.on('updateVehicleLocation', async (data) => {
      const { vehicleId, latitude, longitude, status } = data;

      try {
        // Validate coordinates
        if (!latitude || !longitude || typeof latitude !== 'number' || typeof longitude !== 'number') {
          socket.emit('error', { message: 'Invalid coordinates' });
          return;
        }

        // Rate limiting: only update if last update was more than 2 seconds ago
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
          socket.emit('error', { message: 'Vehicle not found' });
          return;
        }

        const timeSinceLastUpdate = Date.now() - (vehicle.lastUpdated?.getTime() || 0);
        if (timeSinceLastUpdate < 2000) {
          // Silently ignore updates too close together
          return;
        }

        // Update vehicle in database
        const updatedVehicle = await Vehicle.findByIdAndUpdate(
          vehicleId,
          {
            currentLocation: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            status: status || vehicle.status,
            lastUpdated: new Date(),
          },
          { new: true }
        );

        if (updatedVehicle) {
          // Broadcast location update to all subscribed clients
          io.emit('vehicleLocationUpdated', {
            vehicleId: updatedVehicle._id,
            vehicleNumber: updatedVehicle.registrationNumber,
            driverName: updatedVehicle.driverName,
            location: {
              latitude: updatedVehicle.currentLocation.coordinates[1],
              longitude: updatedVehicle.currentLocation.coordinates[0],
            },
            status: updatedVehicle.status,
            timestamp: updatedVehicle.lastUpdated,
          });

          socket.emit('locationUpdateSuccess', {
            vehicleId: updatedVehicle._id,
            timestamp: updatedVehicle.lastUpdated,
          });
        }
      } catch (error) {
        console.error('Error updating vehicle location:', error);
        socket.emit('error', { message: 'Failed to update vehicle location' });
      }
    });

    /**
     * Subscribe to vehicle updates
     * Allows clients to subscribe to updates for specific vehicles
     */
    socket.on('subscribeVehicleUpdates', (data) => {
      const { vehicleId } = data;

      if (!vehicleSubscribers.has(vehicleId)) {
        vehicleSubscribers.set(vehicleId, []);
      }

      const subscribers = vehicleSubscribers.get(vehicleId);
      if (!subscribers.includes(socket.id)) {
        subscribers.push(socket.id);
      }

      // Join vehicle-specific room
      socket.join(`vehicle-${vehicleId}`);

      socket.emit('subscriptionSuccess', {
        vehicleId,
        message: `Subscribed to vehicle ${vehicleId} updates`,
      });

      console.log(`Client ${socket.id} subscribed to vehicle ${vehicleId}`);
    });

    /**
     * Unsubscribe from vehicle updates
     */
    socket.on('unsubscribeVehicleUpdates', (data) => {
      const { vehicleId } = data;

      socket.leave(`vehicle-${vehicleId}`);

      if (vehicleSubscribers.has(vehicleId)) {
        const subscribers = vehicleSubscribers.get(vehicleId);
        const index = subscribers.indexOf(socket.id);
        if (index > -1) {
          subscribers.splice(index, 1);
        }
      }

      console.log(`Client ${socket.id} unsubscribed from vehicle ${vehicleId}`);
    });

    // Real-time bin fill level updates
    socket.on('updateBinFillLevel', async (data) => {
      const { binId, fillLevel, status } = data;

      try {
        const bin = await Bin.findByIdAndUpdate(
          binId,
          {
            currentFillLevel: fillLevel,
            status: status || undefined,
            updatedAt: new Date(),
          },
          { new: true }
        );

        if (bin) {
          io.emit('binFillLevelUpdated', {
            binId: bin._id,
            currentFillLevel: bin.currentFillLevel,
            status: bin.status,
            location: {
              latitude: bin.location.coordinates[1],
              longitude: bin.location.coordinates[0],
            },
          });

          // Alert admins if bin is full
          if (bin.currentFillLevel >= 85) {
            io.emit('binNeedsCollection', {
              binId: bin._id,
              wasteType: bin.wasteType,
              fillLevel: bin.currentFillLevel,
            });
          }
        }
      } catch (error) {
        console.error('Error updating bin fill level:', error);
      }
    });

    // Complaint status updates
    socket.on('complaintStatusChanged', async (data) => {
      const { complaintId, newStatus } = data;

      try {
        const complaint = await Complaint.findByIdAndUpdate(
          complaintId,
          { status: newStatus, updatedAt: new Date() },
          { new: true }
        );

        if (complaint) {
          // Notify the user who filed the complaint
          io.to(`user-${complaint.userId}`).emit('complaintStatusUpdated', {
            complaintId: complaint._id,
            status: complaint.status,
            timestamp: complaint.updatedAt,
          });

          // Broadcast to all admins
          io.emit('complaintUpdated', {
            complaintId: complaint._id,
            status: complaint.status,
            userId: complaint.userId,
          });
        }
      } catch (error) {
        console.error('Error updating complaint status:', error);
      }
    });

    /**
     * Check nearby vehicles (real-time)
     * Allows clients to find vehicles near their location
     */
    socket.on('checkNearbyVehicles', async (data) => {
      const { latitude, longitude, radius = 0.5 } = data; // radius in km

      try {
        const vehicles = await Vehicle.find({
          currentLocation: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
              $maxDistance: radius * 1000,
            },
          },
          status: 'active',
        });

        socket.emit('nearbyVehicles', {
          vehicles: vehicles.map((v) => ({
            id: v._id,
            registration: v.registrationNumber,
            driverName: v.driverName,
            location: {
              latitude: v.currentLocation.coordinates[1],
              longitude: v.currentLocation.coordinates[0],
            },
          })),
        });
      } catch (error) {
        console.error('Error checking nearby vehicles:', error);
        socket.emit('error', { message: 'Failed to check nearby vehicles' });
      }
    });

    /**
     * Check nearby bins (real-time)
     * Allows clients to find bins near their location
     */
    socket.on('checkNearbyBins', async (data) => {
      const { latitude, longitude, radius = 2, wasteType } = data; // radius in km

      try {
        const query = {
          status: 'active',
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
              $maxDistance: radius * 1000,
            },
          },
        };

        if (wasteType) {
          query.wasteType = wasteType;
        }

        const bins = await Bin.find(query);

        socket.emit('nearbyBins', {
          bins: bins.map((b) => ({
            id: b._id,
            binId: b.binId,
            address: b.address,
            wasteType: b.wasteType,
            location: {
              latitude: b.location.coordinates[1],
              longitude: b.location.coordinates[0],
            },
            fillLevel: b.currentFillLevel,
          })),
        });
      } catch (error) {
        console.error('Error checking nearby bins:', error);
        socket.emit('error', { message: 'Failed to check nearby bins' });
      }
    });

    // Notification system
    socket.on('subscribeNotifications', (userId) => {
      socket.join(`notifications-${userId}`);
    });

    socket.on('sendNotification', (data) => {
      const { userId, message, type } = data;
      io.to(`notifications-${userId}`).emit('notification', {
        message,
        type,
        timestamp: new Date(),
      });
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      connectedUsers.delete(socket.id);

      // Clean up vehicle subscriptions
      for (const [vehicleId, subscribers] of vehicleSubscribers) {
        const index = subscribers.indexOf(socket.id);
        if (index > -1) {
          subscribers.splice(index, 1);
        }
      }

      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export default initializeSocket;

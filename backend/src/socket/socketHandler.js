import { Server } from 'socket.io';
import Vehicle from '../models/Vehicle.js';
import Complaint from '../models/Complaint.js';
import Bin from '../models/Bin.js';

let connectedUsers = new Map();

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

    // Vehicle tracking updates
    socket.on('updateVehicleLocation', async (data) => {
      const { vehicleId, latitude, longitude, status } = data;

      try {
        // Update vehicle in database
        const vehicle = await Vehicle.findByIdAndUpdate(
          vehicleId,
          {
            currentLocation: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            status: status || undefined,
            lastUpdated: new Date(),
          },
          { new: true }
        );

        if (vehicle) {
          // Broadcast to all connected clients
          io.emit('vehicleLocationUpdated', {
            vehicleId: vehicle._id,
            vehicleRegistration: vehicle.registrationNumber,
            location: {
              latitude: vehicle.currentLocation.coordinates[1],
              longitude: vehicle.currentLocation.coordinates[0],
            },
            status: vehicle.status,
            timestamp: vehicle.lastUpdated,
          });
        }
      } catch (error) {
        console.error('Error updating vehicle location:', error);
      }
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

    // Listen for location requests (when users are near vehicles)
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
          vehicles: vehicles.map(v => ({
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
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export default initializeSocket;

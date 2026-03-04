import Vehicle from '../models/Vehicle.js';
import { v4 as uuidv4 } from 'uuid';

export const getAllVehicles = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const vehicles = await Vehicle.find(query).populate('currentRoute');
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch vehicles', error: error.message });
  }
};

export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('currentRoute');
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch vehicle', error: error.message });
  }
};

export const createVehicle = async (req, res) => {
  try {
    const { registrationNumber, driverName, driverContact, vehicleType, capacity, currentLocation } = req.body;

    if (!registrationNumber || !driverName || !vehicleType || !currentLocation) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const vehicle = new Vehicle({
      vehicleId: uuidv4(),
      registrationNumber,
      driverName,
      driverContact,
      vehicleType,
      capacity,
      currentLocation: {
        type: 'Point',
        coordinates: [currentLocation.longitude, currentLocation.latitude],
      },
      status: 'offline',
    });

    await vehicle.save();
    res.status(201).json({ message: 'Vehicle created', vehicle });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create vehicle', error: error.message });
  }
};

export const updateVehicleLocation = async (req, res) => {
  try {
    const { latitude, longitude, status } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Location coordinates required' });
    }

    const updateData = {
      currentLocation: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      lastUpdated: new Date(),
    };

    if (status) {
      updateData.status = status;
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({ message: 'Vehicle location updated', vehicle });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update vehicle', error: error.message });
  }
};

export const updateVehicleStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status required' });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({ message: 'Vehicle status updated', vehicle });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update vehicle', error: error.message });
  }
};

export const getVehicleAnalytics = async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    const activeVehicles = await Vehicle.countDocuments({ status: 'active' });
    const offlineVehicles = await Vehicle.countDocuments({ status: 'offline' });
    const totalDistance = await Vehicle.aggregate([
      { $group: { _id: null, totalDist: { $sum: '$totalDistance' } } },
    ]);
    const totalCollections = await Vehicle.aggregate([
      { $group: { _id: null, totalColl: { $sum: '$totalCollections' } } },
    ]);

    res.status(200).json({
      totalVehicles,
      activeVehicles,
      offlineVehicles,
      totalDistance: totalDistance[0]?.totalDist || 0,
      totalCollections: totalCollections[0]?.totalColl || 0,
      avgDistance: totalVehicles > 0 ? (totalDistance[0]?.totalDist || 0) / totalVehicles : 0,
      avgCollections: totalVehicles > 0 ? (totalCollections[0]?.totalColl || 0) / totalVehicles : 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};

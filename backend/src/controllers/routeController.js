import Route from '../models/Route.js';
import Vehicle from '../models/Vehicle.js';
import { v4 as uuidv4 } from 'uuid';

export const createRoute = async (req, res) => {
  try {
    const { vehicleId, routePath, stops, startTime, notes } = req.body;

    if (!vehicleId || !routePath || !stops || !startTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const route = new Route({
      routeId: uuidv4(),
      vehicleId,
      routePath,
      stops,
      startTime,
      notes,
      status: 'planned',
    });

    await route.save();

    // Update vehicle's current route
    await Vehicle.findByIdAndUpdate(vehicleId, { currentRoute: route._id });

    res.status(201).json({ message: 'Route created', route });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create route', error: error.message });
  }
};

export const getRoutes = async (req, res) => {
  try {
    const { vehicleId, status } = req.query;
    let query = {};

    if (vehicleId) query.vehicleId = vehicleId;
    if (status) query.status = status;

    const routes = await Route.find(query)
      .populate('vehicleId', 'registrationNumber driverName')
      .sort({ startTime: -1 });

    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch routes', error: error.message });
  }
};

export const getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id)
      .populate('vehicleId')
      .populate('stops.binId');

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.status(200).json(route);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch route', error: error.message });
  }
};

export const updateRouteStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status required' });
    }

    const updateData = { status, updatedAt: new Date() };

    if (status === 'completed') {
      updateData.endTime = new Date();
    }

    const route = await Route.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.status(200).json({ message: 'Route updated', route });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update route', error: error.message });
  }
};

export const updateRouteStop = async (req, res) => {
  try {
    const { stopIndex, arrivedAt, departedAt, wasteCollected, status } = req.body;

    if (stopIndex === undefined) {
      return res.status(400).json({ message: 'Stop index required' });
    }

    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    if (stopIndex >= route.stops.length) {
      return res.status(400).json({ message: 'Invalid stop index' });
    }

    if (arrivedAt) route.stops[stopIndex].arrivedAt = arrivedAt;
    if (departedAt) route.stops[stopIndex].departedAt = departedAt;
    if (wasteCollected) route.stops[stopIndex].wasteCollected = wasteCollected;
    if (status) route.stops[stopIndex].status = status;

    await route.save();

    res.status(200).json({ message: 'Stop updated', route });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update stop', error: error.message });
  }
};

export const getRouteAnalytics = async (req, res) => {
  try {
    const totalRoutes = await Route.countDocuments();
    const completedRoutes = await Route.countDocuments({ status: 'completed' });
    const avgDistance = await Route.aggregate([
      { $group: { _id: null, avgDist: { $avg: '$distance' } } },
    ]);
    const avgWasteCollected = await Route.aggregate([
      { $group: { _id: null, avgWaste: { $avg: '$wasteCollected' } } },
    ]);

    res.status(200).json({
      totalRoutes,
      completedRoutes,
      activeRoutes: totalRoutes - completedRoutes,
      avgDistance: avgDistance[0]?.avgDist || 0,
      avgWasteCollected: avgWasteCollected[0]?.avgWaste || 0,
      completionRate: totalRoutes > 0 ? ((completedRoutes / totalRoutes) * 100).toFixed(2) + '%' : '0%',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};

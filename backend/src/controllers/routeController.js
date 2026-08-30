import Route from '../models/Route.js';
import Vehicle from '../models/Vehicle.js';
import Bin from '../models/Bin.js';
import { v4 as uuidv4 } from 'uuid';

const CHENNAI_CENTER = {
  latitude: 13.0827,
  longitude: 80.2707,
};

const CHENNAI_BIN_SEED = [
  { binId: 'CHN-BIN-001', latitude: 13.0863, longitude: 80.2701, wasteType: 'mixed', fillLevel: 78, area: 'Parrys Corner' },
  { binId: 'CHN-BIN-002', latitude: 13.0584, longitude: 80.2755, wasteType: 'organic', fillLevel: 61, area: 'Mylapore Tank' },
  { binId: 'CHN-BIN-003', latitude: 13.0487, longitude: 80.2425, wasteType: 'recyclable', fillLevel: 49, area: 'T Nagar Bus Stand' },
  { binId: 'CHN-BIN-004', latitude: 13.0672, longitude: 80.2378, wasteType: 'plastic', fillLevel: 82, area: 'Nungambakkam High Road' },
  { binId: 'CHN-BIN-005', latitude: 13.0849, longitude: 80.2896, wasteType: 'mixed', fillLevel: 35, area: 'Washermanpet Market' },
  { binId: 'CHN-BIN-006', latitude: 13.0358, longitude: 80.2529, wasteType: 'organic', fillLevel: 57, area: 'Saidapet Court' },
  { binId: 'CHN-BIN-007', latitude: 13.0991, longitude: 80.2192, wasteType: 'hazardous', fillLevel: 73, area: 'Anna Nagar West' },
  { binId: 'CHN-BIN-008', latitude: 13.1102, longitude: 80.2865, wasteType: 'recyclable', fillLevel: 44, area: 'Tondiarpet Depot' },
  { binId: 'CHN-BIN-009', latitude: 13.0176, longitude: 80.2249, wasteType: 'plastic', fillLevel: 69, area: 'Guindy Junction' },
  { binId: 'CHN-BIN-010', latitude: 13.1241, longitude: 80.2051, wasteType: 'mixed', fillLevel: 53, area: 'Mogappair East' },
];

const CHENNAI_VEHICLE_SEED = [
  {
    vehicleId: 'CHN-VEH-001',
    registrationNumber: 'TN-01-EM-1101',
    driverName: 'Arun Kumar',
    driverContact: '+919840001101',
    vehicleType: 'compactor',
    capacity: 1800,
    latitude: 13.0843,
    longitude: 80.2632,
    status: 'active',
  },
  {
    vehicleId: 'CHN-VEH-002',
    registrationNumber: 'TN-01-EM-1102',
    driverName: 'Senthil Raj',
    driverContact: '+919840001102',
    vehicleType: 'tipper',
    capacity: 2200,
    latitude: 13.0543,
    longitude: 80.2504,
    status: 'active',
  },
  {
    vehicleId: 'CHN-VEH-003',
    registrationNumber: 'TN-01-EM-1103',
    driverName: 'Madhan G',
    driverContact: '+919840001103',
    vehicleType: 'open_bed',
    capacity: 1500,
    latitude: 13.1004,
    longitude: 80.2256,
    status: 'active',
  },
  {
    vehicleId: 'CHN-VEH-004',
    registrationNumber: 'TN-01-EM-1104',
    driverName: 'Lakshmi Devi',
    driverContact: '+919840001104',
    vehicleType: 'compactor',
    capacity: 1900,
    latitude: 13.0242,
    longitude: 80.2364,
    status: 'on_break',
  },
];

const CHENNAI_ROUTE_SEED = [
  {
    routeId: 'CHN-ROUTE-001',
    registrationNumber: 'TN-01-EM-1101',
    status: 'in_progress',
    notes: 'North Chennai morning collection wave',
    routePath: [
      { latitude: 13.0843, longitude: 80.2632, sequence: 1 },
      { latitude: 13.0863, longitude: 80.2701, sequence: 2 },
      { latitude: 13.0849, longitude: 80.2896, sequence: 3 },
      { latitude: 13.1102, longitude: 80.2865, sequence: 4 },
    ],
    stops: ['CHN-BIN-001', 'CHN-BIN-005', 'CHN-BIN-008'],
  },
  {
    routeId: 'CHN-ROUTE-002',
    registrationNumber: 'TN-01-EM-1102',
    status: 'in_progress',
    notes: 'Central Chennai mixed waste route',
    routePath: [
      { latitude: 13.0543, longitude: 80.2504, sequence: 1 },
      { latitude: 13.0487, longitude: 80.2425, sequence: 2 },
      { latitude: 13.0672, longitude: 80.2378, sequence: 3 },
      { latitude: 13.0991, longitude: 80.2192, sequence: 4 },
    ],
    stops: ['CHN-BIN-003', 'CHN-BIN-004', 'CHN-BIN-007'],
  },
  {
    routeId: 'CHN-ROUTE-003',
    registrationNumber: 'TN-01-EM-1103',
    status: 'planned',
    notes: 'West corridor recyclable pickup',
    routePath: [
      { latitude: 13.1004, longitude: 80.2256, sequence: 1 },
      { latitude: 13.1241, longitude: 80.2051, sequence: 2 },
      { latitude: 13.0991, longitude: 80.2192, sequence: 3 },
    ],
    stops: ['CHN-BIN-010', 'CHN-BIN-007'],
  },
  {
    routeId: 'CHN-ROUTE-004',
    registrationNumber: 'TN-01-EM-1104',
    status: 'planned',
    notes: 'South Chennai reserve route',
    routePath: [
      { latitude: 13.0242, longitude: 80.2364, sequence: 1 },
      { latitude: 13.0176, longitude: 80.2249, sequence: 2 },
      { latitude: 13.0358, longitude: 80.2529, sequence: 3 },
      { latitude: 13.0584, longitude: 80.2755, sequence: 4 },
    ],
    stops: ['CHN-BIN-009', 'CHN-BIN-006', 'CHN-BIN-002'],
  },
];

const CHENNAI_FACILITY = {
  id: 'CHN-FAC-001',
  name: 'Chennai Transfer & Recovery Facility',
  latitude: 13.0678,
  longitude: 80.2372,
};

const LIVE_ROUTE_BLUEPRINTS = [
  {
    routeId: 'CHN-ROUTE-001',
    routeName: 'North Harbor Loop',
    color: '#ff6b00',
    truckRegistration: 'TN-01-EM-1101',
    binIds: ['CHN-BIN-001', 'CHN-BIN-005', 'CHN-BIN-008'],
    approach: [[13.0794, 80.2518]],
  },
  {
    routeId: 'CHN-ROUTE-002',
    routeName: 'Central Grid Loop',
    color: '#0066ff',
    truckRegistration: 'TN-01-EM-1102',
    binIds: ['CHN-BIN-003', 'CHN-BIN-004', 'CHN-BIN-007'],
    approach: [[13.0601, 80.2412]],
  },
  {
    routeId: 'CHN-ROUTE-003',
    routeName: 'West Ring Loop',
    color: '#00a43b',
    truckRegistration: 'TN-01-EM-1103',
    binIds: ['CHN-BIN-010', 'CHN-BIN-007', 'CHN-BIN-009'],
    approach: [[13.0856, 80.2294]],
  },
  {
    routeId: 'CHN-ROUTE-004',
    routeName: 'South Marina Loop',
    color: '#9c27b0',
    truckRegistration: 'TN-01-EM-1104',
    binIds: ['CHN-BIN-002', 'CHN-BIN-006', 'CHN-BIN-009'],
    approach: [[13.0493, 80.2452]],
  },
];

const LIVE_TRUCK_SPEED_KMH = 72;
let logisticsLiveState = null;

const toGeoPoints = (path) => path.map((point) => ({ latitude: point[0], longitude: point[1] }));

const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

const getPointToSegmentDistanceKm = (point, start, end) => {
  const refLat = ((start[0] + end[0]) / 2) * (Math.PI / 180);
  const kmPerDegLat = 111.32;
  const kmPerDegLng = 111.32 * Math.cos(refLat);

  const sx = start[1] * kmPerDegLng;
  const sy = start[0] * kmPerDegLat;
  const ex = end[1] * kmPerDegLng;
  const ey = end[0] * kmPerDegLat;
  const px = point[1] * kmPerDegLng;
  const py = point[0] * kmPerDegLat;

  const dx = ex - sx;
  const dy = ey - sy;
  const lengthSq = dx * dx + dy * dy;

  if (lengthSq === 0) {
    return Math.hypot(px - sx, py - sy);
  }

  const t = Math.max(0, Math.min(1, ((px - sx) * dx + (py - sy) * dy) / lengthSq));
  const closestX = sx + t * dx;
  const closestY = sy + t * dy;
  return Math.hypot(px - closestX, py - closestY);
};

const buildPathSegments = (path) => {
  const segments = [];
  let totalDistanceKm = 0;

  for (let index = 0; index < path.length - 1; index += 1) {
    const start = path[index];
    const end = path[index + 1];
    const distanceKm = getDistanceKm(start[0], start[1], end[0], end[1]);
    totalDistanceKm += distanceKm;
    segments.push({ start, end, distanceKm, cumulativeEndKm: totalDistanceKm });
  }

  return { segments, totalDistanceKm };
};

const interpolatePosition = (route, progressKm) => {
  if (!route?.segments?.length || route.totalDistanceKm <= 0) {
    return route?.path?.[0] || [CHENNAI_FACILITY.latitude, CHENNAI_FACILITY.longitude];
  }

  let normalized = progressKm % route.totalDistanceKm;
  if (normalized < 0) normalized += route.totalDistanceKm;

  for (const segment of route.segments) {
    const segmentStartCumulative = segment.cumulativeEndKm - segment.distanceKm;
    if (normalized <= segment.cumulativeEndKm) {
      const localDistance = normalized - segmentStartCumulative;
      const fraction = segment.distanceKm === 0 ? 0 : localDistance / segment.distanceKm;
      const lat = segment.start[0] + (segment.end[0] - segment.start[0]) * fraction;
      const lng = segment.start[1] + (segment.end[1] - segment.start[1]) * fraction;
      return [lat, lng];
    }
  }

  return route.path[0];
};

const nowTimeLabel = () =>
  new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

const pushActivity = (state, entry) => {
  state.recentActivity = [entry, ...state.recentActivity].slice(0, 8);
};

const isTruckOperational = (state, truck) => {
  const route = state.routes.find((item) => item.routeId === truck.routeId);
  if (!route) {
    return false;
  }

  return route.isEnabled !== false && truck.isEnabled !== false;
};

const initializeLogisticsLiveState = async () => {
  await seedChennaiDemoDataInternal();

  const binsByCode = CHENNAI_BIN_SEED.reduce((acc, seedBin) => {
    acc[seedBin.binId] = {
      id: seedBin.binId,
      binId: seedBin.binId,
      wasteType: seedBin.wasteType,
      area: seedBin.area,
      location: [seedBin.latitude, seedBin.longitude],
      dynamicFillLevel: seedBin.fillLevel,
      lastCollectedAt: null,
      status: seedBin.fillLevel >= 85 ? 'full' : 'active',
    };
    return acc;
  }, {});

  const vehiclesByReg = CHENNAI_VEHICLE_SEED.reduce((acc, vehicle) => {
    acc[vehicle.registrationNumber] = vehicle;
    return acc;
  }, {});

  const routes = LIVE_ROUTE_BLUEPRINTS.map((blueprint) => {
    const binPath = blueprint.binIds
      .map((binId) => binsByCode[binId])
      .filter(Boolean)
      .map((bin) => [bin.location[0], bin.location[1]]);

    const path = [
      [CHENNAI_FACILITY.latitude, CHENNAI_FACILITY.longitude],
      ...binPath,
      [CHENNAI_FACILITY.latitude, CHENNAI_FACILITY.longitude],
    ];

    const { segments, totalDistanceKm } = buildPathSegments(path);
    return {
      routeId: blueprint.routeId,
      routeName: blueprint.routeName,
      color: blueprint.color,
      path,
      geoPath: toGeoPoints(path),
      segments,
      totalDistanceKm,
      binIds: blueprint.binIds,
      isClosed: true,
      isEnabled: true,
      labelPoint: path[Math.floor(path.length / 2)],
      truckRegistration: blueprint.truckRegistration,
    };
  });

  const trucks = routes.map((route, index) => {
    const seededVehicle = vehiclesByReg[route.truckRegistration] || CHENNAI_VEHICLE_SEED[index];
    const firstSegmentDistance = route.segments[0]?.distanceKm || 0;
    const progressKm = Math.max(0, firstSegmentDistance - 0.05 - index * 0.01);
    const position = interpolatePosition(route, progressKm);
    return {
      vehicleId: seededVehicle.vehicleId,
      registrationNumber: seededVehicle.registrationNumber,
      driverName: seededVehicle.driverName,
      driverContact: seededVehicle.driverContact,
      routeId: route.routeId,
      routeName: route.routeName,
      speedKmh: LIVE_TRUCK_SPEED_KMH,
      status: 'active',
      isEnabled: true,
      progressKm,
      currentLocation: position,
      lastFacilityVisitAt: Date.now(),
      lastBinCollectionAt: 0,
    };
  });

  return {
    city: 'Chennai',
    center: [CHENNAI_CENTER.latitude, CHENNAI_CENTER.longitude],
    facility: CHENNAI_FACILITY,
    binsByCode,
    routes,
    trucks,
    completedPickups: 0,
    recentActivity: [
      {
        id: `activity-${Date.now()}-1`,
        time: nowTimeLabel(),
        title: 'Live logistics stream connected',
        detail: 'All four route telemetry channels are reporting from Chennai.',
        note: 'Backend-driven updates enabled',
        tone: 'success',
      },
    ],
    lastUpdatedAt: Date.now(),
  };
};

const tickLogisticsLiveState = (state) => {
  const currentTime = Date.now();
  const elapsedSeconds = Math.max(0.5, (currentTime - state.lastUpdatedAt) / 1000);
  state.lastUpdatedAt = currentTime;

  Object.values(state.binsByCode).forEach((bin) => {
    const refill = elapsedSeconds * 0.9;
    const nextLevel = Math.min(100, bin.dynamicFillLevel + refill);
    bin.dynamicFillLevel = Math.round(nextLevel);
    bin.status = bin.dynamicFillLevel >= 85 ? 'full' : 'active';
  });

  state.trucks.forEach((truck) => {
    const route = state.routes.find((item) => item.routeId === truck.routeId);
    if (!route || route.totalDistanceKm <= 0) {
      return;
    }

    if (!isTruckOperational(state, truck)) {
      truck.status = 'paused';
      return;
    }

    truck.status = 'active';

    const distanceAdvancedKm = (truck.speedKmh * elapsedSeconds) / 3600;
    const previousLocation = [...truck.currentLocation];
    truck.progressKm = (truck.progressKm + distanceAdvancedKm) % route.totalDistanceKm;
    truck.currentLocation = interpolatePosition(route, truck.progressKm);

    const distanceToFacility = getDistanceKm(
      truck.currentLocation[0],
      truck.currentLocation[1],
      state.facility.latitude,
      state.facility.longitude
    );

    if (distanceToFacility <= 0.09 && currentTime - truck.lastFacilityVisitAt > 90000) {
      truck.lastFacilityVisitAt = currentTime;
      pushActivity(state, {
        id: `activity-${currentTime}-${truck.registrationNumber}`,
        time: nowTimeLabel(),
        title: `${truck.registrationNumber} unloaded at transfer facility`,
        detail: `${truck.routeName} completed a disposal cycle at the common intersection point.`,
        note: state.facility.name,
        tone: 'info',
      });
    }

    const assignedBins = route.binIds.map((binId) => state.binsByCode[binId]).filter(Boolean);
    assignedBins.forEach((bin) => {
      if (bin.dynamicFillLevel <= 0) {
        return;
      }

      const segmentDistanceToBin = getPointToSegmentDistanceKm(
        [bin.location[0], bin.location[1]],
        previousLocation,
        truck.currentLocation
      );

      if (
        segmentDistanceToBin <= 0.08 &&
        bin.dynamicFillLevel >= 50 &&
        currentTime - truck.lastBinCollectionAt > 3000
      ) {
        truck.lastBinCollectionAt = currentTime;
        bin.dynamicFillLevel = 0;
        bin.status = 'active';
        bin.lastCollectedAt = new Date(currentTime);
        state.completedPickups += 1;

        pushActivity(state, {
          id: `activity-${currentTime}-${bin.binId}`,
          time: nowTimeLabel(),
          title: `${truck.registrationNumber} cleared ${bin.binId}`,
          detail: `Dustbin at ${bin.area} emptied while running ${truck.routeName}.`,
          note: `Facility handoff: ${state.facility.name}`,
          tone: 'success',
        });
      }
    });
  });
};

const getLiveSnapshot = () => {
  const state = logisticsLiveState;
  const bins = Object.values(state.binsByCode);
  const binsNeedPickup = bins.filter((bin) => bin.dynamicFillLevel >= 50).length;
  const activeRoutesCount = state.routes.filter((route) => route.isEnabled !== false).length;
  const activeTrucksCount = state.trucks.filter((truck) => isTruckOperational(state, truck)).length;

  const routes = state.routes.map((route) => ({
    routeId: route.routeId,
    routeName: route.routeName,
    color: route.color,
    isClosed: route.isClosed,
    isEnabled: route.isEnabled !== false,
    labelPoint: {
      latitude: route.labelPoint[0],
      longitude: route.labelPoint[1],
    },
    path: route.geoPath,
    binIds: route.binIds,
    truckRegistration: route.truckRegistration,
  }));

  const trucks = state.trucks.map((truck) => ({
    vehicleId: truck.vehicleId,
    registrationNumber: truck.registrationNumber,
    driverName: truck.driverName,
    driverContact: truck.driverContact,
    routeId: truck.routeId,
    routeName: truck.routeName,
    status: isTruckOperational(state, truck) ? 'active' : 'paused',
    isEnabled: truck.isEnabled !== false,
    speedKmh: truck.speedKmh,
    currentLocation: {
      latitude: truck.currentLocation[0],
      longitude: truck.currentLocation[1],
    },
  }));

  const formattedBins = bins.map((bin) => ({
    binId: bin.binId,
    wasteType: bin.wasteType,
    address: {
      street: bin.area,
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipcode: '600001',
    },
    location: {
      latitude: bin.location[0],
      longitude: bin.location[1],
    },
    fillLevel: bin.dynamicFillLevel,
    status: bin.status,
    lastCollectedAt: bin.lastCollectedAt,
  }));

  return {
    success: true,
    city: state.city,
    center: {
      latitude: state.center[0],
      longitude: state.center[1],
    },
    facility: state.facility,
    stats: {
      activeRoutes: activeRoutesCount,
      activeVehicles: activeTrucksCount,
      completedPickups: state.completedPickups,
      binsNeedPickup,
    },
    routes,
    trucks,
    bins: formattedBins,
    recentActivity: state.recentActivity,
    updatedAt: new Date(state.lastUpdatedAt),
  };
};

const seedChennaiDemoDataInternal = async () => {
  const binsByCode = {};

  for (const seedBin of CHENNAI_BIN_SEED) {
    const bin = await Bin.findOneAndUpdate(
      { binId: seedBin.binId },
      {
        binId: seedBin.binId,
        location: {
          type: 'Point',
          coordinates: [seedBin.longitude, seedBin.latitude],
        },
        address: {
          street: seedBin.area,
          city: 'Chennai',
          state: 'Tamil Nadu',
          zipcode: '600001',
        },
        wasteType: seedBin.wasteType,
        capacity: 120,
        currentFillLevel: seedBin.fillLevel,
        status: seedBin.fillLevel >= 85 ? 'full' : 'active',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    binsByCode[seedBin.binId] = bin;
  }

  const vehiclesByRegistration = {};

  for (const seedVehicle of CHENNAI_VEHICLE_SEED) {
    const vehicle = await Vehicle.findOneAndUpdate(
      { registrationNumber: seedVehicle.registrationNumber },
      {
        vehicleId: seedVehicle.vehicleId,
        registrationNumber: seedVehicle.registrationNumber,
        driverName: seedVehicle.driverName,
        driverContact: seedVehicle.driverContact,
        vehicleType: seedVehicle.vehicleType,
        capacity: seedVehicle.capacity,
        currentLocation: {
          type: 'Point',
          coordinates: [seedVehicle.longitude, seedVehicle.latitude],
        },
        status: seedVehicle.status,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    vehiclesByRegistration[seedVehicle.registrationNumber] = vehicle;
  }

  for (const seedRoute of CHENNAI_ROUTE_SEED) {
    const vehicle = vehiclesByRegistration[seedRoute.registrationNumber];
    if (!vehicle) {
      continue;
    }

    const stops = seedRoute.stops
      .map((binCode, index) => {
        const bin = binsByCode[binCode];
        if (!bin) {
          return null;
        }

        return {
          binId: bin._id,
          latitude: bin.location.coordinates[1],
          longitude: bin.location.coordinates[0],
          sequence: index + 1,
          status: seedRoute.status === 'in_progress' && index === 0 ? 'reached' : 'pending',
        };
      })
      .filter(Boolean);

    const route = await Route.findOneAndUpdate(
      { routeId: seedRoute.routeId },
      {
        routeId: seedRoute.routeId,
        vehicleId: vehicle._id,
        routePath: seedRoute.routePath,
        stops,
        startTime: new Date(),
        status: seedRoute.status,
        notes: seedRoute.notes,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await Vehicle.findByIdAndUpdate(vehicle._id, { currentRoute: route._id });
  }
};

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

/**
 * Seed demo logistics data for Chennai city.
 * Route: POST /api/routes/seed-demo/chennai
 */
export const seedChennaiDemoData = async (req, res) => {
  try {
    await seedChennaiDemoDataInternal();

    res.status(200).json({
      success: true,
      message: 'Chennai demo logistics data seeded successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to seed Chennai demo data',
      error: error.message,
    });
  }
};

/**
 * Get logistics map payload (bins + vehicles + route paths)
 * Route: GET /api/routes/logistics-map?city=chennai
 */
export const getLogisticsMapData = async (req, res) => {
  try {
    const city = String(req.query.city || 'chennai').toLowerCase();

    if (city !== 'chennai') {
      return res.status(400).json({
        success: false,
        message: 'Only chennai demo map is currently supported',
      });
    }

    let bins = await Bin.find({ status: { $in: ['active', 'full'] } }).sort({ updatedAt: -1 }).limit(250);
    let vehicles = await Vehicle.find({ status: { $in: ['active', 'on_break'] } })
      .populate('currentRoute')
      .sort({ updatedAt: -1 })
      .limit(100);

    if (bins.length === 0 || vehicles.length === 0) {
      await seedChennaiDemoDataInternal();
      bins = await Bin.find({ status: { $in: ['active', 'full'] } }).sort({ updatedAt: -1 }).limit(250);
      vehicles = await Vehicle.find({ status: { $in: ['active', 'on_break'] } })
        .populate('currentRoute')
        .sort({ updatedAt: -1 })
        .limit(100);
    }

    res.status(200).json({
      success: true,
      city: 'Chennai',
      center: CHENNAI_CENTER,
      bins,
      vehicles,
      updatedAt: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch logistics map data',
      error: error.message,
    });
  }
};

/**
 * Backend-driven live logistics snapshot.
 * Route: GET /api/routes/logistics-live?city=chennai
 */
export const getLogisticsLiveData = async (req, res) => {
  try {
    const city = String(req.query.city || 'chennai').toLowerCase();
    if (city !== 'chennai') {
      return res.status(400).json({
        success: false,
        message: 'Only chennai live map is currently supported',
      });
    }

    if (!logisticsLiveState) {
      logisticsLiveState = await initializeLogisticsLiveState();
    }

    tickLogisticsLiveState(logisticsLiveState);
    return res.status(200).json(getLiveSnapshot());
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch live logistics data',
      error: error.message,
    });
  }
};

/**
 * Toggle route/truck operation in live logistics simulation.
 * Route: PUT /api/routes/logistics-live/toggle
 */
export const updateLogisticsLiveToggle = async (req, res) => {
  try {
    const city = String(req.query.city || 'chennai').toLowerCase();
    if (city !== 'chennai') {
      return res.status(400).json({
        success: false,
        message: 'Only chennai live map is currently supported',
      });
    }

    const { type, id, enabled } = req.body || {};
    if (!['route', 'truck'].includes(type) || !id || typeof enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Body must include type (route|truck), id, and enabled (boolean)',
      });
    }

    if (!logisticsLiveState) {
      logisticsLiveState = await initializeLogisticsLiveState();
    }

    if (type === 'route') {
      const route = logisticsLiveState.routes.find((item) => item.routeId === id);
      if (!route) {
        return res.status(404).json({ success: false, message: 'Route not found in live state' });
      }

      route.isEnabled = enabled;
      const truck = logisticsLiveState.trucks.find((item) => item.routeId === route.routeId);
      if (truck) {
        truck.isEnabled = enabled;
        truck.status = enabled ? 'active' : 'paused';
      }

      pushActivity(logisticsLiveState, {
        id: `activity-${Date.now()}-${route.routeId}`,
        time: nowTimeLabel(),
        title: `${route.routeName} ${enabled ? 'resumed' : 'paused'}`,
        detail: enabled
          ? `Route ${route.routeId} and assigned truck are back in motion.`
          : `Route ${route.routeId} and assigned truck are held at current position.`,
        note: logisticsLiveState.facility.name,
        tone: enabled ? 'success' : 'danger',
      });
    }

    if (type === 'truck') {
      const truck = logisticsLiveState.trucks.find((item) => item.vehicleId === id);
      if (!truck) {
        return res.status(404).json({ success: false, message: 'Truck not found in live state' });
      }

      truck.isEnabled = enabled;
      truck.status = enabled ? 'active' : 'paused';

      pushActivity(logisticsLiveState, {
        id: `activity-${Date.now()}-${truck.vehicleId}`,
        time: nowTimeLabel(),
        title: `${truck.registrationNumber} ${enabled ? 'resumed' : 'paused'}`,
        detail: enabled
          ? `${truck.registrationNumber} is moving again on ${truck.routeName}.`
          : `${truck.registrationNumber} is held and will not move until turned on.`,
        note: truck.routeName,
        tone: enabled ? 'success' : 'danger',
      });
    }

    return res.status(200).json(getLiveSnapshot());
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle live logistics state',
      error: error.message,
    });
  }
};

import Bin from '../models/Bin.js';
import Vehicle from '../models/Vehicle.js';

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Find bins near a user's location with optional filters
 * Uses MongoDB geospatial query for efficient lookups
 * @param {number} latitude - User latitude
 * @param {number} longitude - User longitude
 * @param {number} radiusKm - Search radius in kilometers
 * @param {Object} filters - Additional filters (status, wasteType)
 * @returns {Promise<Array>} Array of bins sorted by distance
 */
export const getNearbyBins = async (latitude, longitude, radiusKm = 2, filters = {}) => {
  try {
    const bins = await Bin.find({
      ...filters,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: radiusKm * 1000, // Convert km to meters
        },
      },
    });

    // Add distance to each bin for better user experience
    const binsWithDistance = bins.map((bin) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        bin.location.coordinates[1],
        bin.location.coordinates[0]
      );

      return {
        ...bin.toObject(),
        distance: parseFloat(distance.toFixed(2)), // Distance in km, rounded to 2 decimals
      };
    });

    // Sort by distance
    binsWithDistance.sort((a, b) => a.distance - b.distance);

    return binsWithDistance;
  } catch (error) {
    console.error('Error fetching nearby bins:', error);
    throw error;
  }
};

/**
 * Find vehicles near a location
 * @param {number} latitude - Reference point latitude
 * @param {number} longitude - Reference point longitude
 * @param {number} radiusKm - Search radius in kilometers
 * @param {string} status - Filter by vehicle status (optional)
 * @returns {Promise<Array>} Array of vehicles with calculated distances
 */
export const getNearbyVehicles = async (latitude, longitude, radiusKm = 5, status = 'active') => {
  try {
    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: radiusKm * 1000, // Convert km to meters
        },
      },
    };

    if (status) {
      query.status = status;
    }

    const vehicles = await Vehicle.find(query).populate('currentRoute');

    // Add distance to each vehicle
    const vehiclesWithDistance = vehicles.map((vehicle) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        vehicle.currentLocation.coordinates[1],
        vehicle.currentLocation.coordinates[0]
      );

      return {
        ...vehicle.toObject(),
        distance: parseFloat(distance.toFixed(2)),
      };
    });

    // Sort by distance
    vehiclesWithDistance.sort((a, b) => a.distance - b.distance);

    return vehiclesWithDistance;
  } catch (error) {
    console.error('Error fetching nearby vehicles:', error);
    throw error;
  }
};

/**
 * Get all vehicles with their current locations
 * Used for admin tracking dashboard
 * @returns {Promise<Array>} All vehicles with formatted location data
 */
export const getAllVehicleLocations = async () => {
  try {
    const vehicles = await Vehicle.find({}).populate('currentRoute');

    return vehicles.map((vehicle) => ({
      _id: vehicle._id,
      vehicleId: vehicle.vehicleId,
      registrationNumber: vehicle.registrationNumber,
      driverName: vehicle.driverName,
      driverContact: vehicle.driverContact,
      status: vehicle.status,
      location: {
        latitude: vehicle.currentLocation.coordinates[1],
        longitude: vehicle.currentLocation.coordinates[0],
      },
      lastUpdated: vehicle.lastUpdated,
      currentRoute: vehicle.currentRoute,
    }));
  } catch (error) {
    console.error('Error fetching vehicle locations:', error);
    throw error;
  }
};

/**
 * Calculate estimated time to reach destination
 * Assumes average speed of 30 km/h for urban waste collection
 * @param {number} distanceKm - Distance in kilometers
 * @returns {number} Estimated time in minutes
 */
export const calculateEstimatedTime = (distanceKm) => {
  const avgSpeed = 30; // km/h average speed for urban waste collection
  const timeMinutes = (distanceKm / avgSpeed) * 60;
  return Math.ceil(timeMinutes);
};

/**
 * Validate location coordinates
 * @param {number} latitude - Latitude to validate
 * @param {number} longitude - Longitude to validate
 * @returns {boolean} True if coordinates are valid
 */
export const isValidCoordinates = (latitude, longitude) => {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

export default {
  calculateDistance,
  getNearbyBins,
  getNearbyVehicles,
  getAllVehicleLocations,
  calculateEstimatedTime,
  isValidCoordinates,
};

# Map and Location Tracking Backend Documentation

## Overview

This document describes the backend implementation of the map and location tracking system for the waste management platform. The system uses MongoDB geospatial queries for efficient location-based searches and Socket.IO for real-time location broadcasting.

---

## Database Models

### Bin Model
```javascript
{
  location: {
    type: "Point",              // GeoJSON Point
    coordinates: [lon, lat]     // [longitude, latitude]
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipcode: String
  },
  currentFillLevel: Number,     // 0-100
  lastCollectedAt: Date,
  wasteType: String,            // 'organic', 'plastic', 'mixed', 'hazardous', 'recyclable'
  status: String,               // 'active', 'inactive', 'full', 'maintenance'
  capacity: Number              // in liters
}
```

**Index:** `2dsphere` index on `location` field for geospatial queries

### Vehicle Model
```javascript
{
  currentLocation: {
    type: "Point",              // GeoJSON Point
    coordinates: [lon, lat]     // [longitude, latitude]
  },
  registrationNumber: String,
  driverName: String,
  driverContact: String,
  vehicleType: String,          // 'compactor', 'tipper', 'open_bed'
  status: String,               // 'active', 'offline', 'on_break', 'in_maintenance'
  lastUpdated: Date,
  capacity: Number,             // in liters
  currentLoad: Number,
  totalDistance: Number,        // in km
  totalCollections: Number
}
```

**Index:** `2dsphere` index on `currentLocation` field for geospatial queries

---

## REST API Endpoints

### 1. Get Nearby Bins

**Endpoint:** `GET /api/bins/nearby`

**Query Parameters:**
- `lat` (required): User's latitude (number)
- `lng` (required): User's longitude (number)
- `radius` (optional): Search radius in kilometers (default: 2, max: 50)
- `wasteType` (optional): Filter by waste type ('organic', 'plastic', 'mixed', 'hazardous', 'recyclable')
- `status` (optional): Filter by bin status (default: 'active')

**Example Request:**
```bash
GET /api/bins/nearby?lat=40.7128&lng=-74.0060&radius=2&wasteType=organic&status=active
```

**Example Response:**
```json
{
  "success": true,
  "count": 3,
  "userLocation": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "searchRadius": 2,
  "bins": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "binId": "bin-123",
      "location": {
        "type": "Point",
        "coordinates": [-74.0062, 40.7130]
      },
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipcode": "10001"
      },
      "wasteType": "organic",
      "capacity": 100,
      "currentFillLevel": 65,
      "status": "active",
      "distance": 0.25,           // in kilometers
      "estimatedTimeToReach": 1   // in minutes
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "binId": "bin-124",
      "location": {
        "type": "Point",
        "coordinates": [-74.0040, 40.7125]
      },
      "address": {
        "street": "456 Oak Ave",
        "city": "New York",
        "state": "NY",
        "zipcode": "10002"
      },
      "wasteType": "organic",
      "capacity": 100,
      "currentFillLevel": 45,
      "status": "active",
      "distance": 0.33,
      "estimatedTimeToReach": 1
    }
  ]
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid parameters (missing lat/lng, invalid coordinates, invalid radius)
- `500`: Server error

---

### 2. Get Nearby Vehicles

**Endpoint:** `GET /api/vehicles/nearby`

**Query Parameters:**
- `lat` (required): User's latitude (number)
- `lng` (required): User's longitude (number)
- `radius` (optional): Search radius in kilometers (default: 5, max: 100)
- `status` (optional): Filter by vehicle status (default: 'active')

**Example Request:**
```bash
GET /api/vehicles/nearby?lat=40.7128&lng=-74.0060&radius=5&status=active
```

**Example Response:**
```json
{
  "success": true,
  "count": 2,
  "userLocation": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "searchRadius": 5,
  "vehicles": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "vehicleId": "v-001",
      "registrationNumber": "ABC-1234",
      "driverName": "John Doe",
      "driverContact": "555-0101",
      "status": "active",
      "location": {
        "latitude": 40.7140,
        "longitude": -74.0055
      },
      "distance": 0.12,              // in kilometers
      "estimatedTimeToReach": 1,     // in minutes
      "lastUpdated": "2026-03-04T10:30:00Z",
      "currentRoute": "507f1f77bcf86cd799439050"
    }
  ]
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid parameters
- `500`: Server error

---

### 3. Update Vehicle Location

**Endpoint:** `PUT /api/vehicles/:id/location`

**Authentication:** Required (JWT token)

**Request Body:**
```json
{
  "latitude": 40.7140,
  "longitude": -74.0055,
  "status": "active"  // optional
}
```

**Example Request:**
```bash
curl -X PUT http://localhost:5000/api/vehicles/507f1f77bcf86cd799439020/location \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 40.7140,
    "longitude": -74.0055,
    "status": "active"
  }'
```

**Example Response:**
```json
{
  "message": "Vehicle location updated",
  "success": true,
  "vehicle": {
    "_id": "507f1f77bcf86cd799439020",
    "vehicleId": "v-001",
    "registrationNumber": "ABC-1234",
    "driverName": "John Doe",
    "status": "active",
    "location": {
      "latitude": 40.7140,
      "longitude": -74.0055
    },
    "lastUpdated": "2026-03-04T10:35:00Z"
  }
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid coordinates
- `401`: Unauthorized
- `404`: Vehicle not found
- `500`: Server error

---

## Socket.IO Events

### Real-Time Vehicle Location Tracking

#### 1. Update Vehicle Location (Driver → Server)

**Event Name:** `updateVehicleLocation`

**Emit From:** Vehicle driver/tracker app

**Example:**
```javascript
socket.emit('updateVehicleLocation', {
  vehicleId: '507f1f77bcf86cd799439020',
  latitude: 40.7140,
  longitude: -74.0055,
  status: 'active'   // optional
});
```

**Response Events:**
- On success: `locationUpdateSuccess`
- On error: `error`

---

#### 2. Vehicle Location Updated (Server → Clients)

**Event Name:** `vehicleLocationUpdated`

**Emitted To:** All connected clients

**Example Payload:**
```javascript
{
  vehicleId: '507f1f77bcf86cd799439020',
  vehicleNumber: 'ABC-1234',
  driverName: 'John Doe',
  location: {
    latitude: 40.7140,
    longitude: -74.0055
  },
  status: 'active',
  timestamp: '2026-03-04T10:35:00Z'
}
```

---

#### 3. Subscribe to Vehicle Updates (Client → Server)

**Event Name:** `subscribeVehicleUpdates`

**Purpose:** Subscribe to real-time updates for a specific vehicle

**Example:**
```javascript
socket.emit('subscribeVehicleUpdates', {
  vehicleId: '507f1f77bcf86cd799439020'
});
```

**Response Event:** `subscriptionSuccess`
```javascript
{
  vehicleId: '507f1f77bcf86cd799439020',
  message: 'Subscribed to vehicle 507f1f77bcf86cd799439020 updates'
}
```

---

#### 4. Unsubscribe from Vehicle Updates (Client → Server)

**Event Name:** `unsubscribeVehicleUpdates`

**Example:**
```javascript
socket.emit('unsubscribeVehicleUpdates', {
  vehicleId: '507f1f77bcf86cd799439020'
});
```

---

### Real-Time Location Queries

#### 5. Check Nearby Vehicles (Client → Server)

**Event Name:** `checkNearbyVehicles`

**Purpose:** Find vehicles near current location in real-time

**Example:**
```javascript
socket.emit('checkNearbyVehicles', {
  latitude: 40.7128,
  longitude: -74.0060,
  radius: 0.5  // radius in km (optional, default: 0.5)
});
```

**Response Event:** `nearbyVehicles`
```javascript
{
  vehicles: [
    {
      id: '507f1f77bcf86cd799439020',
      registration: 'ABC-1234',
      driverName: 'John Doe',
      location: {
        latitude: 40.7140,
        longitude: -74.0055
      }
    }
  ]
}
```

---

#### 6. Check Nearby Bins (Client → Server)

**Event Name:** `checkNearbyBins`

**Purpose:** Find bins near current location in real-time

**Example:**
```javascript
socket.emit('checkNearbyBins', {
  latitude: 40.7128,
  longitude: -74.0060,
  radius: 2,              // radius in km (optional, default: 2)
  wasteType: 'organic'    // optional filter
});
```

**Response Event:** `nearbyBins`
```javascript
{
  bins: [
    {
      id: '507f1f77bcf86cd799439011',
      binId: 'bin-123',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipcode: '10001'
      },
      wasteType: 'organic',
      location: {
        latitude: 40.7130,
        longitude: -74.0062
      },
      fillLevel: 65
    }
  ]
}
```

---

### Error Handling

**Error Event:** `error`

**Example:**
```javascript
socket.on('error', (data) => {
  console.error('Socket error:', data.message);
});
```

**Common Error Messages:**
- `Invalid coordinates` - Coordinates outside valid range
- `Vehicle not found` - Vehicle ID doesn't exist
- `Failed to update vehicle location` - Database error
- `Failed to check nearby vehicles` - Query error
- `Failed to check nearby bins` - Query error

---

## Location Service Module

**File:** `backend/src/services/locationService.js`

### Available Functions

#### 1. `calculateDistance(lat1, lon1, lat2, lon2)`

Calculates distance between two coordinates using Haversine formula.

**Returns:** Distance in kilometers (number)

**Example:**
```javascript
import { calculateDistance } from '../services/locationService.js';

const distance = calculateDistance(40.7128, -74.0060, 40.7140, -74.0055);
console.log(distance); // 0.13
```

---

#### 2. `getNearbyBins(latitude, longitude, radiusKm, filters)`

Finds bins near a location with optional filters.

**Parameters:**
- `latitude` (number): User latitude
- `longitude` (number): User longitude
- `radiusKm` (number): Search radius in kilometers
- `filters` (object): Optional filters (status, wasteType)

**Returns:** Promise<Array> - Array of bins with distance property

**Example:**
```javascript
import { getNearbyBins } from '../services/locationService.js';

const bins = await getNearbyBins(
  40.7128,
  -74.0060,
  2,
  { status: 'active', wasteType: 'organic' }
);
```

---

#### 3. `getNearbyVehicles(latitude, longitude, radiusKm, status)`

Finds vehicles near a location.

**Returns:** Promise<Array> - Array of vehicles with distance property

**Example:**
```javascript
import { getNearbyVehicles } from '../services/locationService.js';

const vehicles = await getNearbyVehicles(
  40.7128,
  -74.0060,
  5,
  'active'
);
```

---

#### 4. `calculateEstimatedTime(distanceKm)`

Calculates estimated time to reach destination (assumes 30 km/h average speed).

**Returns:** Number - Estimated time in minutes

**Example:**
```javascript
import { calculateEstimatedTime } from '../services/locationService.js';

const time = calculateEstimatedTime(0.5); // 1 minute
```

---

#### 5. `isValidCoordinates(latitude, longitude)`

Validates latitude and longitude values.

**Returns:** Boolean - true if coordinates are valid

**Example:**
```javascript
import { isValidCoordinates } from '../services/locationService.js';

isValidCoordinates(40.7128, -74.0060);  // true
isValidCoordinates(91, 200);              // false
```

---

## Frontend Integration Examples

### Using REST API (via Fetch/Axios)

**Find nearby bins:**
```javascript
// Frontend: src/services/binService.js
import axios from 'axios';

export const getNearbyBins = async (latitude, longitude, radius = 2, wasteType = null) => {
  try {
    const params = new URLSearchParams({
      lat: latitude,
      lng: longitude,
      radius: radius,
    });

    if (wasteType) {
      params.append('wasteType', wasteType);
    }

    const response = await axios.get(`/api/bins/nearby?${params}`);
    return response.data.bins;
  } catch (error) {
    console.error('Failed to fetch nearby bins:', error);
    throw error;
  }
};
```

**Find nearby vehicles:**
```javascript
// Frontend: src/services/vehicleService.js
export const getNearbyVehicles = async (latitude, longitude, radius = 5) => {
  try {
    const response = await axios.get('/api/vehicles/nearby', {
      params: {
        lat: latitude,
        lng: longitude,
        radius: radius,
      },
    });
    return response.data.vehicles;
  } catch (error) {
    console.error('Failed to fetch nearby vehicles:', error);
    throw error;
  }
};
```

---

### Using Socket.IO

**Subscribe to vehicle location updates:**
```javascript
// Frontend: src/components/LiveTracking/index.jsx
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

// Subscribe to a specific vehicle
socket.emit('subscribeVehicleUpdates', {
  vehicleId: '507f1f77bcf86cd799439020'
});

// Listen for location updates
socket.on('vehicleLocationUpdated', (data) => {
  console.log('Vehicle moved:', data.location);
  // Update map with new location
});

// Unsubscribe when component unmounts
socket.emit('unsubscribeVehicleUpdates', {
  vehicleId: '507f1f77bcf86cd799439020'
});
```

**Find nearby vehicles in real-time:**
```javascript
// Get user's current location
navigator.geolocation.getCurrentPosition((position) => {
  socket.emit('checkNearbyVehicles', {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    radius: 0.5
  });

  socket.on('nearbyVehicles', (data) => {
    console.log('Found vehicles:', data.vehicles);
    // Update map with nearby vehicles
  });
});
```

---

## Performance Considerations

1. **Database Indexes:** Both `Bin` and `Vehicle` models have `2dsphere` indexes on location fields for efficient geospatial queries.

2. **Rate Limiting:** Vehicle location updates via Socket.IO are rate-limited to prevent excessive database writes (minimum 2 seconds between updates).

3. **Distance Calculation:** Distances are calculated using the Haversine formula, which is efficient for mapping applications.

4. **Socket Rooms:** Subscription-based updates use Socket.IO rooms to reduce broadcast overhead.

5. **Query Optimization:** Geospatial queries return results sorted by distance by default.

---

## Security Considerations

1. **Authentication:** Vehicle location updates via REST API require JWT authentication.
2. **Coordinate Validation:** All coordinates are validated before processing.
3. **Input Sanitization:** Query parameters are parsed and validated.
4. **Error Messages:** Generic error messages to prevent information leakage.

---

## Testing Endpoints with cURL

### Test nearby bins endpoint
```bash
curl "http://localhost:5000/api/bins/nearby?lat=40.7128&lng=-74.0060&radius=2"
```

### Test nearby vehicles endpoint
```bash
curl "http://localhost:5000/api/vehicles/nearby?lat=40.7128&lng=-74.0060&radius=5"
```

### Test vehicle location update (requires token)
```bash
curl -X PUT "http://localhost:5000/api/vehicles/VEHICLE_ID/location" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 40.7140,
    "longitude": -74.0055,
    "status": "active"
  }'
```

---

## Coordinate Format Reference

**Valid Coordinate Range:**
- Latitude: -90 to +90 (North/South)
- Longitude: -180 to +180 (East/West)

**GeoJSON Format:**
```json
{
  "type": "Point",
  "coordinates": [longitude, latitude]  // Note: longitude first!
}
```

**Important:** GeoJSON uses [longitude, latitude] order, not [latitude, longitude].

---

## Future Enhancements

1. **Streaming Locations:** Use Server-Sent Events (SSE) as an alternative to Socket.IO
2. **Route Optimization:** Implement route optimization algorithm for efficient bin collection
3. **Geofencing:** Alert drivers when approaching collection zones
4. **Heatmaps:** Display bin density and collection patterns on admin dashboard
5. **ETA Prediction:** Machine learning-based estimated time of arrival

---

**Last Updated:** March 4, 2026
**Version:** 1.0.0

# Map and Location Tracking - Quick Reference Guide

## 🚀 Quick Start

### Installation
No additional packages needed - all dependencies already exist in the project.

### Database Setup
Geospatial indexes are already created on both models:
- `Bin.location` - 2dsphere index
- `Vehicle.currentLocation` - 2dsphere index

## 📍 Core Endpoints

### Get Nearby Bins
```bash
GET /api/bins/nearby?lat=40.7128&lng=-74.0060&radius=2
```
**No authentication required**

### Get Nearby Vehicles  
```bash
GET /api/vehicles/nearby?lat=40.7128&lng=-74.0060&radius=5
```
**No authentication required**

### Update Vehicle Location
```bash
PUT /api/vehicles/{vehicleId}/location
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "latitude": 40.7140,
  "longitude": -74.0055,
  "status": "active"
}
```
**Authentication required**

---

## 🔌 Socket.IO Events

### Driver: Send Location
```javascript
socket.emit('updateVehicleLocation', {
  vehicleId: '507f1f77bcf86cd799439020',
  latitude: 40.7140,
  longitude: -74.0055,
  status: 'active'
});
```

### Client: Subscribe to Vehicle Updates
```javascript
socket.emit('subscribeVehicleUpdates', {
  vehicleId: '507f1f77bcf86cd799439020'
});

socket.on('vehicleLocationUpdated', (data) => {
  console.log('Vehicle location:', data.location);
});
```

### Client: Find Nearby Vehicles
```javascript
socket.emit('checkNearbyVehicles', {
  latitude: 40.7128,
  longitude: -74.0060,
  radius: 0.5
});

socket.on('nearbyVehicles', (data) => {
  console.log('Found vehicles:', data.vehicles);
});
```

### Client: Find Nearby Bins
```javascript
socket.emit('checkNearbyBins', {
  latitude: 40.7128,
  longitude: -74.0060,
  radius: 2,
  wasteType: 'organic'
});

socket.on('nearbyBins', (data) => {
  console.log('Found bins:', data.bins);
});
```

---

## 📁 File Locations

| Component | File |
|-----------|------|
| Location Service | `backend/src/services/locationService.js` |
| Bin Routes | `backend/src/routes/bins.js` |
| Vehicle Routes | `backend/src/routes/vehicles.js` |
| Bin Controller | `backend/src/controllers/binController.js` |
| Vehicle Controller | `backend/src/controllers/vehicleController.js` |
| Socket Handler | `backend/src/socket/socketHandler.js` |
| API Docs | `docs/MAP_AND_TRACKING_API.md` |
| Implementation Summary | `IMPLEMENTATION_SUMMARY.md` |

---

## 🧪 Testing Examples

### Test Nearby Bins
```bash
curl "http://localhost:5000/api/bins/nearby?lat=40.7128&lng=-74.0060&radius=2&wasteType=organic"
```

### Test Nearby Vehicles
```bash
curl "http://localhost:5000/api/vehicles/nearby?lat=40.7128&lng=-74.0060&radius=5"
```

### Test Vehicle Location Update
```bash
curl -X PUT "http://localhost:5000/api/vehicles/507f1f77bcf86cd799439020/location" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 40.7140,
    "longitude": -74.0055,
    "status": "active"
  }'
```

---

## ⚙️ Configuration

### Environment Variables (already set in server.js)
```env
CORS_ORIGIN=http://localhost:3000
SOCKET_IO_CORS_ORIGIN=http://localhost:3000
```

### Database Indexes (auto-created)
- Bin: `db.bins.createIndex({ "location": "2dsphere" })`
- Vehicle: `db.vehicles.createIndex({ "currentLocation": "2dsphere" })`

---

## 🛡️ Key Validations

### Coordinates
- Latitude: -90 to +90
- Longitude: -180 to +180

### Radius
- Bins: 0-50 km (default: 2)
- Vehicles: 0-100 km (default: 5)

### Rate Limiting
- Location updates: 2-second minimum interval
- API rate limiter: Applied to all /nearby endpoints

---

## 📊 Response Format

### Success Response
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
      "_id": "...",
      "location": {...},
      "distance": 0.25,           // km
      "estimatedTimeToReach": 1   // minutes
    }
  ]
}
```

### Error Response
```json
{
  "message": "Error Description",
  "error": "Detailed error message"
}
```

---

## 🔄 Distance and Time Calculation

**Distance:** Haversine formula (great-circle distance)
**Unit:** Kilometers
**Speed Assumption:** 30 km/h (average urban speed)
**Time Formula:** `(distance / 30) * 60` = minutes

### Examples
- 0.25 km → 1 minute travel time
- 0.5 km → 1 minute travel time
- 1 km → 2 minutes travel time
- 5 km → 10 minutes travel time

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `Coordinates out of range` | Verify lat/lng are within valid ranges |
| `No results found` | Check radius (may be too small) or bin status filter |
| Socket updates not received | Verify client is subscribed to vehicle |
| Empty location object | Verify coordinates are in `[lon, lat]` format |

---

## 📚 Full Documentation

For complete API documentation with examples:
→ See `docs/MAP_AND_TRACKING_API.md`

For implementation details:
→ See `IMPLEMENTATION_SUMMARY.md`

---

## 🚀 Deployment Checklist

- [ ] Verify MongoDB connection
- [ ] Verify geospatial indexes exist
- [ ] Check CORS configuration
- [ ] Set environment variables
- [ ] Test REST API endpoints
- [ ] Test Socket.IO events
- [ ] Verify authentication tokens work
- [ ] Test with Leaflet map on frontend

---

## 📞 Support Resources

1. **Location Service** - All geospatial calculations
2. **Bin Controller** - `getNearbyBins()` endpoint
3. **Vehicle Controller** - `getNearbyVehicles()` endpoint  
4. **Socket Handler** - Real-time location events

---

**Version:** 1.0.0  
**Last Updated:** March 4, 2026  
**Status:** Production Ready ✅

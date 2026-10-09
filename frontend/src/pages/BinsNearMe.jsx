import { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import binService from '../services/binService.js';

// Fix Leaflet's default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Haversine formula to calculate distance between two coordinates in km
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

const BinsNearMe = () => {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resolvedLocation, setResolvedLocation] = useState(null);
  const [autoDetecting, setAutoDetecting] = useState(false);
  const [filters, setFilters] = useState({
    location: '13.0827, 80.2707', // Default to Chennai center to match seed data
    nearestCount: 5,
    wasteType: '',
  });

  // Routing state
  const [selectedBinPath, setSelectedBinPath] = useState(null);
  const [routeGeometry, setRouteGeometry] = useState(null);
  const [routingLoading, setRoutingLoading] = useState(false);
  const [routingError, setRoutingError] = useState('');

  const geocodeLocation = async (locationName) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(locationName)}`
    );

    if (!response.ok) {
      throw new Error('Unable to resolve the location right now.');
    }

    const results = await response.json();
    if (!Array.isArray(results) || results.length === 0) {
      throw new Error('No coordinates found for that location. Try a more specific place name.');
    }

    return {
      latitude: Number(results[0].lat),
      longitude: Number(results[0].lon),
      displayName: results[0].display_name,
    };
  };

  const searchBins = async (latitude, longitude, filterObj = null) => {
    setLoading(true);
    setError('');
    try {
      const searchFilters = filterObj || filters;
      // Fetch all bins, optionally filtered by wasteType and status on the backend
      const filtersForBackend = { status: 'active' };
      if (searchFilters.wasteType) {
        filtersForBackend.wasteType = searchFilters.wasteType;
      }
      
      const allBins = await binService.getAllBins(filtersForBackend);

      // Perform distance calculation on the client side
      // Removed radius limit to always show the N absolute nearest bins
      
      const binsWithDistance = allBins.map(bin => {
        // Handle GeoJSON Point coordinates (longitude, latitude)
        let binLat, binLng;
        if (bin.location && bin.location.coordinates) {
          binLng = bin.location.coordinates[0];
          binLat = bin.location.coordinates[1];
        }
        
        if (binLat !== undefined && binLng !== undefined) {
          const distance = getDistanceKm(latitude, longitude, binLat, binLng);
          return { ...bin, distance };
        }
        return null;
      }).filter(bin => bin !== null);

      // Sort by distance (closest first)
      binsWithDistance.sort((a, b) => a.distance - b.distance);

      const nearestCount = Math.max(1, Number(searchFilters.nearestCount) || 1);
      setBins(binsWithDistance.slice(0, nearestCount));
      setResolvedLocation({ latitude, longitude });
    } catch (error) {
      console.error('Failed to fetch bins:', error);
      setError(error?.response?.data?.message || error.message || 'Failed to fetch nearby bins.');
      setBins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleAutoDetect = () => {
    setError('');

    if (!navigator.geolocation) {
      setError('Your browser does not support location detection.');
      return;
    }

    setAutoDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setFilters((prev) => ({
          ...prev,
          location: 'Current location',
        }));

        try {
          await searchBins(latitude, longitude, {
            ...filters,
            location: 'Current location',
          });
          setResolvedLocation({ latitude, longitude });
        } finally {
          setAutoDetecting(false);
        }
      },
      (geoError) => {
        setAutoDetecting(false);
        setError(geoError.message || 'Unable to detect your location.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSearch = async () => {
    const locationName = filters.location.trim();
    const nearestCount = Number(filters.nearestCount);

    if (!locationName) {
      setError('Please enter a location to search from.');
      return;
    }

    if (!Number.isFinite(nearestCount) || nearestCount <= 0) {
      setError('Please enter a valid number of nearest bins to show.');
      return;
    }

    if (locationName === 'Current location' && resolvedLocation) {
      await searchBins(resolvedLocation.latitude, resolvedLocation.longitude, {
        ...filters,
        nearestCount,
      });
      return;
    }

    // Check if the input is a coordinate pair (e.g. "13.0827, 80.2707")
    const coordMatch = locationName.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
    if (coordMatch) {
      const latitude = parseFloat(coordMatch[1]);
      const longitude = parseFloat(coordMatch[3]);
      await searchBins(latitude, longitude, {
        ...filters,
        nearestCount,
      });
      return;
    }

    try {
      const location = await geocodeLocation(locationName);
      await searchBins(location.latitude, location.longitude, {
        ...filters,
        nearestCount,
      });
      setResolvedLocation(location);
    } catch (searchError) {
      console.error('Failed to resolve location:', searchError);
      setError(searchError?.message || 'Failed to resolve location.');
      setBins([]);
    }
  };

  const handleShowPath = async (bin) => {
    setSelectedBinPath(bin);
    setRouteGeometry(null);
    setRoutingError('');
    setRoutingLoading(true);

    try {
      const userLat = resolvedLocation.latitude;
      const userLng = resolvedLocation.longitude;
      const binLat = bin.location.coordinates[1];
      const binLng = bin.location.coordinates[0];

      // Use public OSRM driving route API
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${binLng},${binLat}?overview=full&geometries=geojson`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch route');
      }

      const data = await response.json();
      if (data.code === 'Ok' && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates;
        // OSRM returns [lon, lat], Leaflet expects [lat, lon]
        const latLngs = coords.map((c) => [c[1], c[0]]);
        setRouteGeometry(latLngs);
      } else {
        throw new Error('No route found');
      }
    } catch (err) {
      console.error('Routing error:', err);
      setRoutingError('Could not calculate a route to this bin.');
    } finally {
      setRoutingLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'full':
        return 'error';
      case 'inactive':
        return 'default';
      default:
        return 'warning';
    }
  };

  const getWasteTypeColor = (wasteType) => {
    const colors = {
      organic: '#4caf50',
      plastic: '#2196f3',
      mixed: '#ff9800',
      hazardous: '#f44336',
      recyclable: '#009688',
    };
    return colors[wasteType] || '#999';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        🗑️ Find Waste Bins Near You
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Enter a place name, address, or area and we will locate the nearest bins for you.
      </Typography>

      {/* Filters */}
      <Card sx={{ boxShadow: 2, mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="e.g. Connaught Place, New Delhi"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="N nearest bins"
                name="nearestCount"
                type="number"
                inputProps={{ min: 1, step: 1 }}
                value={filters.nearestCount}
                onChange={handleFilterChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleAutoDetect}
                disabled={loading || autoDetecting}
                sx={{ height: '56px' }}
              >
                {autoDetecting ? 'Detecting...' : 'Auto Detect My Location'}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Waste Type</InputLabel>
                <Select
                  name="wasteType"
                  value={filters.wasteType}
                  onChange={handleFilterChange}
                  label="Waste Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="organic">Organic</MenuItem>
                  <MenuItem value="plastic">Plastic</MenuItem>
                  <MenuItem value="mixed">Mixed</MenuItem>
                  <MenuItem value="hazardous">Hazardous</MenuItem>
                  <MenuItem value="recyclable">Recyclable</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </Grid>
          </Grid>
          {resolvedLocation && (
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Search point: {resolvedLocation.latitude.toFixed(6)}, {resolvedLocation.longitude.toFixed(6)}
            </Typography>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Results */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {bins.length > 0 ? (
            bins.map((bin) => (
              <Grid item xs={12} sm={6} md={4} key={bin._id}>
                <Card sx={{ boxShadow: 2, height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Bin {bin.binId?.slice(0, 8)}
                      </Typography>
                      <Chip
                        label={bin.status}
                        color={getStatusColor(bin.status)}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Type:</strong>{' '}
                      <span style={{ color: getWasteTypeColor(bin.wasteType), fontWeight: 'bold' }}>
                        {bin.wasteType}
                      </span>
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Fill Level:</strong> {bin.currentFillLevel}%
                    </Typography>
                    <Box sx={{ height: 6, bgcolor: '#e0e0e0', borderRadius: 3, mb: 2, overflow: 'hidden' }}>
                      <Box
                        sx={{
                          height: '100%',
                          width: `${bin.currentFillLevel}%`,
                          bgcolor: bin.currentFillLevel > 80 ? '#f44336' : bin.currentFillLevel > 50 ? '#ff9800' : '#4caf50',
                        }}
                      />
                    </Box>

                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Capacity:</strong> {bin.capacity} L
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Location:</strong> {bin.address?.street}, {bin.address?.city}
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Coordinates:</strong> {bin.location?.coordinates?.[1]?.toFixed?.(6) ?? bin.location?.coordinates?.[1]}, {bin.location?.coordinates?.[0]?.toFixed?.(6) ?? bin.location?.coordinates?.[0]}
                    </Typography>
                    
                    {bin.distance !== undefined && (
                      <Typography variant="body2" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                        <strong>Distance:</strong> {bin.distance.toFixed(2)} km
                      </Typography>
                    )}

                    {bin.currentFillLevel > 85 && (
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        This bin needs collection soon!
                      </Alert>
                    )}

                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1, width: '100%', borderColor: 'primary.main', color: 'primary.main' }}
                      onClick={() => handleShowPath(bin)}
                      disabled={!resolvedLocation}
                    >
                      Show Path
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Alert severity="info">No bins found in the selected area. Try increasing the search radius.</Alert>
            </Grid>
          )}
        </Grid>
      )}

      {/* Path Dialog */}
      <Dialog
        open={Boolean(selectedBinPath)}
        onClose={() => setSelectedBinPath(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          Route to Bin {selectedBinPath?.binId?.slice(0, 8)}
        </DialogTitle>
        <DialogContent dividers>
          {routingLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}
          {routingError && <Alert severity="error">{routingError}</Alert>}
          {!routingLoading && routeGeometry && selectedBinPath && resolvedLocation && (
            <Box sx={{ height: 400, width: '100%', borderRadius: 1, overflow: 'hidden' }}>
              <MapContainer
                center={routeGeometry[Math.floor(routeGeometry.length / 2)] || [resolvedLocation.latitude, resolvedLocation.longitude]}
                zoom={12}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[resolvedLocation.latitude, resolvedLocation.longitude]}>
                  <Popup>Your Search Location</Popup>
                </Marker>
                <Marker position={[selectedBinPath.location.coordinates[1], selectedBinPath.location.coordinates[0]]}>
                  <Popup>Waste Bin: {selectedBinPath.wasteType}</Popup>
                </Marker>
                <Polyline positions={routeGeometry} color="#1b5e20" weight={6} opacity={0.8} />
              </MapContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setSelectedBinPath(null)} color="inherit" variant="outlined">
            Close Map
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BinsNearMe;

import { useState, useEffect } from 'react';
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
} from '@mui/material';
import binService from '../services/binService.js';

const BinsNearMe = () => {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    radius: 2,
    wasteType: '',
  });
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        searchBins(position.coords.latitude, position.coords.longitude);
      });
    }
  }, []);

  const searchBins = async (latitude, longitude, filterObj = null) => {
    setLoading(true);
    try {
      const searchFilters = filterObj || filters;
      const nearbyBins = await binService.getNearbyBins(latitude, longitude, searchFilters.radius);
      
      let filtered = nearbyBins;
      if (searchFilters.wasteType) {
        filtered = nearbyBins.filter((bin) => bin.wasteType === searchFilters.wasteType);
      }
      
      setBins(filtered);
    } catch (error) {
      console.error('Failed to fetch bins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    if (userLocation) {
      searchBins(userLocation.latitude, userLocation.longitude, filters);
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

      {/* Filters */}
      <Card sx={{ boxShadow: 2, mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Search Radius (km)"
                name="radius"
                type="number"
                value={filters.radius}
                onChange={handleFilterChange}
              />
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
        </CardContent>
      </Card>

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

                    {bin.currentFillLevel > 85 && (
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        This bin needs collection soon!
                      </Alert>
                    )}

                    <Button fullWidth variant="outlined" size="small">
                      Get Directions
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
    </Container>
  );
};

export default BinsNearMe;

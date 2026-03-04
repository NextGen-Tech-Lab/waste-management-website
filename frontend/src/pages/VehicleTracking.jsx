import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import vehicleService from '../services/vehicleService.js';
import { useEffect as useSocketEffect } from 'react';
import io from 'socket.io-client';

const VehicleTracking = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchVehicles();
    initializeSocket();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await vehicleService.getAllVehicles({ status: 'active' });
      setVehicles(data);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeSocket = () => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl);

    newSocket.on('vehicleLocationUpdated', (data) => {
      setVehicles((prev) =>
        prev.map((v) =>
          v._id === data.vehicleId
            ? { ...v, currentLocation: { coordinates: [data.location.longitude, data.location.latitude] }, status: data.status }
            : v
        )
      );
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'offline':
        return 'default';
      case 'on_break':
        return 'warning';
      case 'in_maintenance':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        🚗 Live Vehicle Tracking
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Vehicle Cards */}
          <Grid item xs={12} md={8}>
            {vehicles.length > 0 ? (
              <TableContainer component={Card} sx={{ boxShadow: 2 }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Registration</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Driver</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vehicles.map((vehicle) => (
                      <TableRow key={vehicle._id} sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                        <TableCell>{vehicle.registrationNumber}</TableCell>
                        <TableCell>{vehicle.driverName}</TableCell>
                        <TableCell>{vehicle.vehicleType}</TableCell>
                        <TableCell>
                          <Chip label={vehicle.status} color={getStatusColor(vehicle.status)} size="small" />
                        </TableCell>
                        <TableCell>
                          {vehicle.currentLocation?.coordinates[1].toFixed(4)}, {vehicle.currentLocation?.coordinates[0].toFixed(4)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Card sx={{ boxShadow: 2 }}>
                <CardContent>
                  <Typography>No active vehicles at the moment.</Typography>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Statistics */}
          <Grid item xs={12} md={4}>
            <Card sx={{ boxShadow: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Fleet Overview
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {vehicles.length}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Active Vehicles: {vehicles.filter((v) => v.status === 'active').length}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  On Break: {vehicles.filter((v) => v.status === 'on_break').length}
                </Typography>
                <Typography variant="body2">
                  In Maintenance: {vehicles.filter((v) => v.status === 'in_maintenance').length}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ boxShadow: 2, mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Tips
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  ✓ Vehicles update their location every few seconds<br />
                  ✓ Green indicates active vehicles<br />
                  ✓ Red indicates maintenance mode<br />
                  ✓ You'll receive notifications when a vehicle is near your location
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default VehicleTracking;

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import binService from '../services/binService.js';
import vehicleService from '../services/vehicleService.js';
import complaintService from '../services/complaintService.js';
import educationService from '../services/educationService.js';
import routeService from '../services/routeService.js';

const AdminDashboard = () => {
  const [binAnalytics, setBinAnalytics] = useState(null);
  const [vehicleAnalytics, setVehicleAnalytics] = useState(null);
  const [complaintAnalytics, setComplaintAnalytics] = useState(null);
  const [educationAnalytics, setEducationAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [bins, vehicles, complaints, education] = await Promise.all([
        binService.getBinAnalytics(),
        vehicleService.getVehicleAnalytics(),
        complaintService.getComplaintAnalytics(),
        educationService.getContentAnalytics(),
      ]);

      setBinAnalytics(bins);
      setVehicleAnalytics(vehicles);
      setComplaintAnalytics(complaints);
      setEducationAnalytics(education);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        📊 Admin Dashboard
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Typography color="inherit" gutterBottom>
                Total Bins
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {binAnalytics?.totalBins || 0}
              </Typography>
              <Typography variant="body2">
                {binAnalytics?.activeBins || 0} Active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 2, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Typography color="inherit" gutterBottom>
                Active Vehicles
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {vehicleAnalytics?.activeVehicles || 0}
              </Typography>
              <Typography variant="body2">
                Total: {vehicleAnalytics?.totalVehicles || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 2, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Typography color="inherit" gutterBottom>
                Pending Complaints
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {complaintAnalytics?.pendingComplaints || 0}
              </Typography>
              <Typography variant="body2">
                Total: {complaintAnalytics?.totalComplaints || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 2, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent>
              <Typography color="inherit" gutterBottom>
                Published Content
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {educationAnalytics?.publishedContent || 0}
              </Typography>
              <Typography variant="body2">
                Draft: {educationAnalytics?.draftContent || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Waste Type Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                📊 Waste Type Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={binAnalytics?.byWasteType || []}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Complaint Status Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                📋 Complaint Status
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={complaintAnalytics?.byCategory || []}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Vehicle Analytics */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                🚗 Vehicle Performance
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Total Distance Covered
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {(vehicleAnalytics?.totalDistance || 0).toFixed(2)} km
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Total Collections
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {vehicleAnalytics?.totalCollections || 0}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Avg Distance per Vehicle
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {(vehicleAnalytics?.avgDistance || 0).toFixed(2)} km
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Avg Collections per Vehicle
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {(vehicleAnalytics?.avgCollections || 0).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Complaint Resolution */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                ✅ Complaint Management
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Resolution Rate
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                    {complaintAnalytics?.resolutionRate || '0%'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Resolved Complaints
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {complaintAnalytics?.resolvedComplaints || 0}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Pending Complaints
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                    {complaintAnalytics?.pendingComplaints || 0}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Total Complaints
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {complaintAnalytics?.totalComplaints || 0}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;

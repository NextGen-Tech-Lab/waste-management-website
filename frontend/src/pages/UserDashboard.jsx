import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { useAuth } from '../utils/useAuth.js';
import authService from '../services/authService.js';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await authService.getProfile();
      setProfile(data);
      setEditData(data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to load profile');
      setMessageType('error');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setEditData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await authService.updateProfile(editData);
      setProfile(editData);
      setOpenEditDialog(false);
      setMessage('Profile updated successfully');
      setMessageType('success');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {message && <Alert severity={messageType} sx={{ mb: 3 }}>{message}</Alert>}

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                👤 My Profile
              </Typography>
              <Typography sx={{ mb: 2 }}>
                <strong>Name:</strong> {profile.name}
              </Typography>
              <Typography sx={{ mb: 2 }}>
                <strong>Email:</strong> {profile.email}
              </Typography>
              <Typography sx={{ mb: 2 }}>
                <strong>Phone:</strong> {profile.phone}
              </Typography>
              <Typography sx={{ mb: 2 }}>
                <strong>Address:</strong> {profile.address?.street}, {profile.address?.city}, {profile.address?.state}
              </Typography>
              <Button
                variant="contained"
                onClick={() => setOpenEditDialog(true)}
                sx={{ mr: 1 }}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  logout();
                  window.location.href = '/';
                }}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button fullWidth variant="contained" href="/user/bins">
                  Find Bins Near Me
                </Button>
                <Button fullWidth variant="contained" href="/user/tracking">
                  Track Waste Vehicles
                </Button>
                <Button fullWidth variant="contained" href="/user/complaints">
                  Submit Complaint
                </Button>
                <Button fullWidth variant="contained" href="/education">
                  Learn About Coding
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={editData.name || ''}
            onChange={handleEditChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={editData.phone || ''}
            onChange={handleEditChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Street"
            name="address.street"
            value={editData.address?.street || ''}
            onChange={handleEditChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="City"
            name="address.city"
            value={editData.address?.city || ''}
            onChange={handleEditChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="State"
            name="address.state"
            value={editData.address?.state || ''}
            onChange={handleEditChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Zip Code"
            name="address.zipcode"
            value={editData.address?.zipcode || ''}
            onChange={handleEditChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateProfile}
            variant="contained"
            disabled={loading}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserDashboard;

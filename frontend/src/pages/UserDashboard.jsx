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
  Chip,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth.js';
import authService from '../services/authService.js';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
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
      if (user) {
        setProfile(user);
        setEditData(user);
        setMessage('Demo mode active: profile data is local until backend is connected.');
        setMessageType('info');
      } else {
        setMessage(error.response?.data?.message || 'Failed to load profile');
        setMessageType('error');
      }
    } finally {
      setLoading(false);
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
      return;
    }

    setEditData((prev) => ({ ...prev, [name]: value }));
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading && !profile) {
    return (
      <Container sx={{ py: 6, textAlign: 'center' }}>
        <Typography>Loading dashboard...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 4, bgcolor: '#f4f7f4' }}>
      <Container maxWidth="lg">
        {message && (
          <Alert severity={messageType} sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        <Box
          sx={{
            p: { xs: 2.5, md: 4 },
            mb: 3,
            borderRadius: 2,
            color: 'white',
            background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
            boxShadow: '0 10px 24px rgba(27, 94, 32, 0.22)',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Citizen Dashboard
          </Typography>
          <Typography sx={{ opacity: 0.95 }}>
            Welcome back, {profile?.name || user?.name || 'Citizen'}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b5e20', mb: 2 }}>
                  My Profile
                </Typography>
                <Typography sx={{ mb: 1 }}><strong>Name:</strong> {profile?.name}</Typography>
                <Typography sx={{ mb: 1 }}><strong>Email:</strong> {profile?.email}</Typography>
                <Typography sx={{ mb: 1 }}><strong>Phone:</strong> {profile?.phone || '-'}</Typography>
                <Typography sx={{ mb: 2 }}>
                  <strong>Address:</strong> {profile?.address?.street || '-'}, {profile?.address?.city || '-'}, {profile?.address?.state || '-'} {profile?.address?.zipcode || ''}
                </Typography>
                <Chip
                  label={(profile?.role || 'user').toUpperCase()}
                  size="small"
                  sx={{ backgroundColor: '#e8f5e9', color: '#1b5e20', mb: 2 }}
                />
                <Divider sx={{ mb: 2 }} />
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setOpenEditDialog(true)}
                  sx={{ mb: 1.5, textTransform: 'none', backgroundColor: '#1b5e20' }}
                >
                  Edit Profile
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{ textTransform: 'none' }}
                >
                  Logout
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ borderRadius: 2, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>Find Bins</Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                      Locate waste bins near your location.
                    </Typography>
                    <Button variant="contained" fullWidth sx={{ textTransform: 'none' }} onClick={() => navigate('/user/bins')}>
                      Open Bins Near Me
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card sx={{ borderRadius: 2, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>Vehicle Tracking</Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                      Track collection routes in real time.
                    </Typography>
                    <Button variant="contained" fullWidth sx={{ textTransform: 'none' }} onClick={() => navigate('/user/tracking')}>
                      Open Tracking
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card sx={{ borderRadius: 2, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>Complaints</Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                      Report issues and monitor status updates.
                    </Typography>
                    <Button variant="contained" fullWidth sx={{ textTransform: 'none' }} onClick={() => navigate('/user/complaints')}>
                      Submit Complaint
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card sx={{ borderRadius: 2, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>Education Center</Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                      Learn segregation and responsible disposal.
                    </Typography>
                    <Button variant="contained" fullWidth sx={{ textTransform: 'none' }} onClick={() => navigate('/education')}>
                      Open Education
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <TextField fullWidth label="Name" name="name" value={editData.name || ''} onChange={handleEditChange} margin="normal" />
          <TextField fullWidth label="Phone" name="phone" value={editData.phone || ''} onChange={handleEditChange} margin="normal" />
          <TextField fullWidth label="Street" name="address.street" value={editData.address?.street || ''} onChange={handleEditChange} margin="normal" />
          <TextField fullWidth label="City" name="address.city" value={editData.address?.city || ''} onChange={handleEditChange} margin="normal" />
          <TextField fullWidth label="State" name="address.state" value={editData.address?.state || ''} onChange={handleEditChange} margin="normal" />
          <TextField fullWidth label="Zip Code" name="address.zipcode" value={editData.address?.zipcode || ''} onChange={handleEditChange} margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleUpdateProfile} variant="contained" disabled={loading}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserDashboard;

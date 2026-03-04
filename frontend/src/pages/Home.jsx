import { Box, Container, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth.js';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Hero Section */}
      <Box sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Waste Management Platform
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Connecting citizens with municipal waste management authorities
          </Typography>
          {!isAuthenticated && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                sx={{ bgcolor: 'white', color: '#667eea' }}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{ borderColor: 'white', color: 'white' }}
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {isAuthenticated && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" gutterBottom>
              Welcome, {user?.name}! 👋
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
              {isAdmin
                ? 'You have admin access. Manage operations, complaints, and content.'
                : 'Find waste bins, track vehicles, and manage your waste responsibly.'}
            </Typography>
            <Grid container spacing={2}>
              {isAdmin ? (
                <>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button fullWidth variant="contained" onClick={() => navigate('/admin/dashboard')}>
                      Admin Dashboard
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button fullWidth variant="contained" onClick={() => navigate('/admin/complaints')}>
                      Manage Complaints
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button fullWidth variant="contained" onClick={() => navigate('/admin/vehicles')}>
                      Track Vehicles
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button fullWidth variant="contained" onClick={() => navigate('/admin/education')}>
                      Education Content
                    </Button>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button fullWidth variant="contained" onClick={() => navigate('/user/dashboard')}>
                      Dashboard
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button fullWidth variant="contained" onClick={() => navigate('/user/bins')}>
                      Find Bins
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button fullWidth variant="contained" onClick={() => navigate('/user/tracking')}>
                      Track Vehicles
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button fullWidth variant="contained" onClick={() => navigate('/user/complaints')}>
                      Submit Complaint
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  📍 Find Bins Near You
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Locate waste bins using your location and filter by waste type.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  🚗 Live Vehicle Tracking
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Track waste collection vehicles in real-time with estimated arrival times.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  📝 Submit Complaints
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Report issues and track the resolution of your complaints.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  📚 Learn Waste Management
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Educational content on waste segregation, recycling, and composting.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  📊 Analytics & Insights
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Admin panel with detailed analytics and operational insights.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  🔐 Secure & Reliable
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Enterprise-grade security with JWT authentication and role-based access control.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ background: '#f9f9f9', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Get Started Today
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 3, color: '#666' }}>
            Join our waste management platform and help create a cleaner, more sustainable city.
          </Typography>
          {!isAuthenticated && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                Start Now
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Home;

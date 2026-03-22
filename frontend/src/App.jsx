import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Container, Menu, MenuItem } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ErrorIcon from '@mui/icons-material/Error';
import SchoolIcon from '@mui/icons-material/School';
import { AuthProvider } from './context/AuthContext.jsx';
import { useAuth } from './utils/useAuth.js';

// Pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import BinsNearMe from './pages/BinsNearMe.jsx';
import VehicleTracking from './pages/VehicleTracking.jsx';
import ComplaintManagement from './pages/ComplaintManagement.jsx';
import EducationCenter from './pages/EducationCenter.jsx';
import Schemes from './pages/Schemes.jsx';
import Impact from './pages/Impact.jsx';
import Resources from './pages/Resources.jsx';
import EducationalMaterials from './pages/EducationalMaterials.jsx';
import PolicyDocuments from './pages/PolicyDocuments.jsx';
import ToolsCalculators from './pages/ToolsCalculators.jsx';
import CommunityResources from './pages/CommunityResources.jsx';

// Calculator Pages
import CarbonFootprintCalculator from './pages/CarbonFootprintCalculator.jsx';
import RecyclingRateCalculator from './pages/RecyclingRateCalculator.jsx';
import WasteTrackerCalculator from './pages/WasteTrackerCalculator.jsx';
import CompostingCalculator from './pages/CompostingCalculator.jsx';
import PlasticReductionCalculator from './pages/PlasticReductionCalculator.jsx';
import WasteSegmentationAssistant from './pages/WasteSegmentationAssistant.jsx';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useAuth();
  
  // Check both context state and localStorage for token
  const hasToken = isAuthenticated || !!localStorage.getItem('token');

  if (!hasToken) {
    return <Navigate to="/login" />;
  }

  if (requiredRole === 'admin') {
    // Check if user has admin role - check both context and localStorage
    const contextIsAdmin = user?.role === 'admin';
    let storageIsAdmin = false;
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        storageIsAdmin = parsedUser?.role === 'admin';
      }
    } catch (e) {
      // Ignore parse errors
    }
    
    if (!contextIsAdmin && !storageIsAdmin) {
      return <Navigate to="/user/dashboard" />;
    }
  }

  return children;
};

// Navigation Bar Component - Only shows when authenticated
const NavBar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [featuresAnchorEl, setFeaturesAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFeaturesMenuOpen = (event) => {
    setFeaturesAnchorEl(event.currentTarget);
  };

  const handleFeaturesMenuClose = () => {
    setFeaturesAnchorEl(null);
  };

  const handleFeatureNavigate = (path) => {
    navigate(path);
    handleFeaturesMenuClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Hide navbar on public auth screens.
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  // Admin section has its own shell navigation - hide navbar for all admin routes
  if (location.pathname.startsWith('/admin/')) {
    return null;
  }

  // Only render navbar for authenticated users
  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        background: 'linear-gradient(90deg, #0E7C3B 0%, #2E7D32 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 87, 61, 0.2)',
        color: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 87, 61, 0.15)',
      }}
    >
      <Toolbar sx={{ minHeight: '64px' }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#ffffff',
          }}
          onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard')}
        >
          🌍 EcoManage
        </Typography>

        {isAuthenticated && (
          <>
            {isAdmin && (
              <Button sx={{ color: '#ffffff', fontWeight: 700, '&:hover': { background: 'rgba(255, 255, 255, 0.15)' } }} onClick={() => navigate('/admin/dashboard')}>
                Admin Dashboard
              </Button>
            )}
            <Button
              sx={{ color: '#ffffff', fontWeight: 700, '&:hover': { background: 'rgba(255, 255, 255, 0.15)' } }}
              onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard')}
            >
              Dashboard
            </Button>

            <Button
              sx={{ color: '#ffffff', fontWeight: 700, '&:hover': { background: 'rgba(255, 255, 255, 0.15)' } }}
              onClick={handleFeaturesMenuOpen}
            >
              Features ▼
            </Button>
            <Menu
              anchorEl={featuresAnchorEl}
              open={Boolean(featuresAnchorEl)}
              onClose={handleFeaturesMenuClose}
              MenuListProps={{
                onMouseLeave: handleFeaturesMenuClose,
              }}
            >
              <MenuItem
                onClick={() => handleFeatureNavigate('/user/bins')}
                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
              >
                <PlaceIcon sx={{ fontSize: 20, color: '#ff6b6b' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Locate Bins
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999', fontSize: '11px' }}>
                    Find nearby disposal points
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem
                onClick={() => handleFeatureNavigate('/user/tracking')}
                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
              >
                <LocalShippingIcon sx={{ fontSize: 20, color: '#4dabf7' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Track Vehicle
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999', fontSize: '11px' }}>
                    Live garbage truck route
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem
                onClick={() => handleFeatureNavigate('/user/complaints')}
                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
              >
                <ErrorIcon sx={{ fontSize: 20, color: '#ff922b' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Lodge Complaint
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999', fontSize: '11px' }}>
                    Report littering or spills
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem
                onClick={() => handleFeatureNavigate('/education')}
                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
              >
                <SchoolIcon sx={{ fontSize: 20, color: '#51cf66' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Waste Education
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999', fontSize: '11px' }}>
                    Sorting and recycling guide
                  </Typography>
                </Box>
              </MenuItem>
            </Menu>

            <Button
              sx={{ color: '#ffffff', fontWeight: 700, '&:hover': { background: 'rgba(255, 255, 255, 0.15)' } }}
              onClick={() => navigate('/schemes')}
            >
              Schemes
            </Button>

            <Button
              sx={{ color: '#ffffff', fontWeight: 700, '&:hover': { background: 'rgba(255, 255, 255, 0.15)' } }}
              onClick={() => navigate('/impact')}
            >
              Impact
            </Button>

            <Button
              sx={{ color: '#ffffff', fontWeight: 700, '&:hover': { background: 'rgba(255, 255, 255, 0.15)' } }}
              onClick={() => navigate('/resources')}
            >
              Resources
            </Button>

            <Button
              sx={{ color: '#ffffff', fontWeight: 700, ml: 2, '&:hover': { background: 'rgba(255, 255, 255, 0.15)' } }}
              onClick={handleMenuOpen}
            >
              {user?.name} ▼
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard')}>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

// Footer Component
const Footer = () => {
  const location = useLocation();

  if (location.pathname === '/admin/dashboard') {
    return null;
  }

  return (
    <Box sx={{ background: '#f5f5f5', py: 3, mt: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="body2" align="center" sx={{ color: '#666' }}>
          © 2026 Waste Management Platform. All rights reserved. | Built with React, Node.js, and MongoDB
        </Typography>
      </Container>
    </Box>
  );
};

// Main App Component
export const AppContent = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <Box sx={{ flex: 1 }}>
        <Routes>
          {/* Public Routes - Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Root redirects to login if not authenticated */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* User Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/bins"
            element={
              <ProtectedRoute>
                <BinsNearMe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/tracking"
            element={
              <ProtectedRoute>
                <VehicleTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/complaints"
            element={
              <ProtectedRoute>
                <ComplaintManagement />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/complaints"
            element={
              <ProtectedRoute requiredRole="admin">
                <ComplaintManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vehicles"
            element={
              <ProtectedRoute requiredRole="admin">
                <VehicleTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/education"
            element={
              <ProtectedRoute requiredRole="admin">
                <EducationCenter />
              </ProtectedRoute>
            }
          />

          {/* Public Pages */}
          <Route
            path="/education"
            element={
              <ProtectedRoute>
                <EducationCenter />
              </ProtectedRoute>
            }
          />

          {/* Public Information Pages */}
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/educational-materials" element={<EducationalMaterials />} />
          <Route path="/resources/policy-documents" element={<PolicyDocuments />} />
          <Route path="/resources/tools-calculators" element={<ToolsCalculators />} />
          <Route path="/resources/community-resources" element={<CommunityResources />} />

          {/* Calculator Routes */}
          <Route path="/calculator/carbon-footprint" element={<CarbonFootprintCalculator />} />
          <Route path="/calculator/waste-tracker" element={<WasteTrackerCalculator />} />
          <Route path="/calculator/recycling-rate" element={<RecyclingRateCalculator />} />
          <Route path="/calculator/composting" element={<CompostingCalculator />} />
          <Route path="/calculator/plastic-reduction" element={<PlasticReductionCalculator />} />
          <Route path="/calculator/waste-segregation" element={<WasteSegmentationAssistant />} />

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;

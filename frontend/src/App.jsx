import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Container, Menu, MenuItem } from '@mui/material';
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

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Hide navbar on public auth screens.
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  // Admin dashboard has its own shell navigation.
  if (location.pathname === '/admin/dashboard') {
    return null;
  }

  // Only render navbar for authenticated users
  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(248, 250, 248, 0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e1e3e1',
        color: '#191c1b',
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
            color: '#00450d',
          }}
          onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard')}
        >
          🌍 EcoManage
        </Typography>

        {isAuthenticated && (
          <>
            {isAdmin && (
              <Button sx={{ color: '#2f332f', fontWeight: 700 }} onClick={() => navigate('/admin/dashboard')}>
                Admin Dashboard
              </Button>
            )}
            <Button
              sx={{ color: '#2f332f', fontWeight: 700 }}
              onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard')}
            >
              Dashboard
            </Button>
            <Button sx={{ color: '#2f332f', fontWeight: 700 }} onClick={() => navigate('/education')}>
              Education Center
            </Button>

            <Button
              sx={{ color: '#2f332f', fontWeight: 700, ml: 2 }}
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

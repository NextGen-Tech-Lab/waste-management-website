import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/user/dashboard" />;
  }

  return children;
};

// Navigation Bar Component
const NavBar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => (window.location.href = '/')}
        >
          ♻️ Waste Management
        </Typography>

        {isAuthenticated ? (
          <>
            {isAdmin && (
              <Button color="inherit" href="/admin/dashboard">
                Admin
              </Button>
            )}
            <Button color="inherit" href={isAdmin ? '/admin/dashboard' : '/user/dashboard'}>
              Dashboard
            </Button>
            <Button color="inherit" href="/education">
              Learn
            </Button>

            <Button
              color="inherit"
              onClick={handleMenuOpen}
              sx={{ ml: 2 }}
            >
              {user?.name} ▼
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => (window.location.href = isAdmin ? '/admin/dashboard' : '/user/dashboard')}>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" href="/login" sx={{ mr: 1 }}>
              Login
            </Button>
            <Button color="inherit" variant="outlined" href="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

// Footer Component
const Footer = () => {
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
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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
          <Route path="*" element={<Navigate to="/" />} />
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

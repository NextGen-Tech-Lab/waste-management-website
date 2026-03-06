import { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Link as MuiLink,
  Card,
  CardContent,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth.js';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const formCardSx = {
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  borderRadius: 2,
  overflow: 'hidden',
  border: '1px solid #d6e6d8',
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [activeRole, setActiveRole] = useState('citizen');

  const [citizenData, setCitizenData] = useState({ email: '', password: '' });
  const [adminData, setAdminData] = useState({ email: '', password: '' });

  const [citizenError, setCitizenError] = useState('');
  const [adminError, setAdminError] = useState('');
  const [loadingRole, setLoadingRole] = useState('');

  const handleCitizenChange = (e) => {
    const { name, value } = e.target;
    setCitizenData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCitizenSubmit = async (e) => {
    e.preventDefault();
    setCitizenError('');
    setAdminError('');
    setLoadingRole('citizen');

    try {
      await login(citizenData.email, citizenData.password);
      navigate('/user/dashboard');
    } catch (err) {
      setCitizenError(err.response?.data?.message || 'Citizen login failed. Please check credentials.');
    } finally {
      setLoadingRole('');
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setCitizenError('');
    setAdminError('');
    setLoadingRole('admin');

    try {
      const authResult = await login(adminData.email, adminData.password);
      const isAdmin = authResult?.user?.role === 'admin';
      if (!isAdmin) {
        setAdminError('This account does not have admin access.');
        return;
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setAdminError(err.response?.data?.message || 'Admin login failed. Please check credentials.');
    } finally {
      setLoadingRole('');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#eef3ef',
      }}
    >
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
          color: 'white',
          padding: '2rem 1rem 5rem 1rem',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', mr: 2 }}>
              🌍
            </Typography>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                EcoManage India
              </Typography>
              <Typography variant="subtitle1" sx={{ fontSize: '0.9rem', opacity: 0.95 }}>
                Public Waste Management Portal
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 1.5, bgcolor: 'rgba(255,255,255,0.3)' }} />
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Login securely as Citizen or Admin
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mt: { xs: -4, md: -6 }, mb: 4 }}>
        <Card sx={formCardSx}>
          <Box
            sx={{
              p: 1,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1,
              bgcolor: '#f4f7f4',
              borderBottom: '1px solid #e4ece5',
            }}
          >
            <Button
              variant={activeRole === 'citizen' ? 'contained' : 'text'}
              onClick={() => setActiveRole('citizen')}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 1.5,
                color: activeRole === 'citizen' ? 'white' : '#1b5e20',
                background:
                  activeRole === 'citizen'
                    ? 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)'
                    : 'transparent',
              }}
            >
              Citizen Login
            </Button>
            <Button
              variant={activeRole === 'admin' ? 'contained' : 'text'}
              onClick={() => setActiveRole('admin')}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 1.5,
                color: activeRole === 'admin' ? 'white' : '#1b5e20',
                background:
                  activeRole === 'admin'
                    ? 'linear-gradient(135deg, #1f6f2c 0%, #2e7d32 100%)'
                    : 'transparent',
              }}
            >
              Admin Login
            </Button>
          </Box>

          <CardContent sx={{ p: 0, overflow: 'hidden' }}>
            {/* Smooth left-right transition between login forms */}
            <Box
              sx={{
                width: '200%',
                display: 'flex',
                transform: activeRole === 'citizen' ? 'translateX(0)' : 'translateX(-50%)',
                transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <Box sx={{ width: '50%', p: { xs: 2.5, md: 3.5 } }}>
                <Box sx={{ textAlign: 'center', mb: 2.5 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                      mb: 1.5,
                      color: 'white',
                    }}
                  >
                    <LockIcon sx={{ fontSize: 30 }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: '#124d1a' }}>
                    Citizen Login
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Access services, complaints, and tracking
                  </Typography>
                </Box>

                <Alert
                  severity="info"
                  sx={{
                    mb: 2,
                    borderRadius: 1,
                    backgroundColor: '#e8f5e9',
                    color: '#1b5e20',
                    border: '1px solid #a5d6a7',
                    '& .MuiAlert-icon': { color: '#1b5e20' },
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#1b5e20' }}>
                    Demo Citizen: <strong>citizen@example.com</strong> / <strong>1234</strong>
                  </Typography>
                </Alert>

                {citizenError && (
                  <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
                    {citizenError}
                  </Alert>
                )}

                <form onSubmit={handleCitizenSubmit}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
                        Email Address
                      </Typography>
                      <TextField
                        fullWidth
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={citizenData.email}
                        onChange={handleCitizenChange}
                        required
                        disabled={loadingRole === 'citizen'}
                        slotProps={{
                          input: {
                            startAdornment: <EmailIcon sx={{ mr: 1.5, color: '#1b5e20' }} />,
                          },
                        }}
                      />
                    </Box>

                    <Box>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
                        Password
                      </Typography>
                      <TextField
                        fullWidth
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={citizenData.password}
                        onChange={handleCitizenChange}
                        required
                        disabled={loadingRole === 'citizen'}
                        slotProps={{
                          input: {
                            startAdornment: <LockIcon sx={{ mr: 1.5, color: '#1b5e20' }} />,
                          },
                        }}
                      />
                    </Box>

                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      disabled={loadingRole === 'citizen'}
                      sx={{
                        mt: 0.5,
                        py: 1.2,
                        background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                        fontWeight: 600,
                        fontSize: '1rem',
                        borderRadius: 1,
                        textTransform: 'none',
                      }}
                    >
                      {loadingRole === 'citizen' ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Login as Citizen'}
                    </Button>
                  </Box>
                </form>
              </Box>

              <Box sx={{ width: '50%', p: { xs: 2.5, md: 3.5 } }}>
                <Box sx={{ textAlign: 'center', mb: 2.5 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1f6f2c 0%, #2e7d32 100%)',
                      mb: 1.5,
                      color: 'white',
                    }}
                  >
                    <AdminPanelSettingsIcon sx={{ fontSize: 30 }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: '#124d1a' }}>
                    Admin Login
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Access monitoring and city controls
                  </Typography>
                </Box>

                <Alert
                  severity="info"
                  sx={{
                    mb: 2,
                    borderRadius: 1,
                    backgroundColor: '#e8f5e9',
                    color: '#1b5e20',
                    border: '1px solid #a5d6a7',
                    '& .MuiAlert-icon': { color: '#1b5e20' },
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#1b5e20' }}>
                    Demo Admin: <strong>admin@example.com</strong> / <strong>1234</strong>
                  </Typography>
                </Alert>

                {adminError && (
                  <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
                    {adminError}
                  </Alert>
                )}

                <form onSubmit={handleAdminSubmit}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
                        Email Address
                      </Typography>
                      <TextField
                        fullWidth
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={adminData.email}
                        onChange={handleAdminChange}
                        required
                        disabled={loadingRole === 'admin'}
                        slotProps={{
                          input: {
                            startAdornment: <EmailIcon sx={{ mr: 1.5, color: '#1b5e20' }} />,
                          },
                        }}
                      />
                    </Box>

                    <Box>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
                        Password
                      </Typography>
                      <TextField
                        fullWidth
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={adminData.password}
                        onChange={handleAdminChange}
                        required
                        disabled={loadingRole === 'admin'}
                        slotProps={{
                          input: {
                            startAdornment: <LockIcon sx={{ mr: 1.5, color: '#1b5e20' }} />,
                          },
                        }}
                      />
                    </Box>

                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      disabled={loadingRole === 'admin'}
                      sx={{
                        mt: 0.5,
                        py: 1.2,
                        background: 'linear-gradient(135deg, #1f6f2c 0%, #2e7d32 100%)',
                        fontWeight: 600,
                        fontSize: '1rem',
                        borderRadius: 1,
                        textTransform: 'none',
                      }}
                    >
                      {loadingRole === 'admin' ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Login as Admin'}
                    </Button>
                  </Box>
                </form>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 2.5, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            New citizen?{' '}
            <MuiLink
              href="/register"
              onClick={(e) => {
                e.preventDefault();
                navigate('/register');
              }}
              sx={{
                color: '#1b5e20',
                fontWeight: 700,
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Register here
            </MuiLink>
          </Typography>
        </Box>
      </Container>

      <Box
        sx={{
          mt: 'auto',
          background: '#f9f9f9',
          borderTop: '1px solid #e0e0e0',
          py: 2,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="caption" sx={{ color: '#999' }}>
            © 2026 EcoManage India | Public Waste Management Services
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;

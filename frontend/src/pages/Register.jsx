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
  Grid,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth.js';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipcode: '',
    },
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        role: 'user',
      });
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #ffffff 0%, #f0f4f0 100%)',
      }}
    >
      {/* Header with Logo */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
          color: 'white',
          padding: '2rem 1rem',
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
                EcoManage
              </Typography>
              <Typography variant="subtitle1" sx={{ fontSize: '0.9rem', opacity: 0.95 }}>
                National Waste Management System
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 1.5, bgcolor: 'rgba(255,255,255,0.3)' }} />
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Register as a Citizen to Participate in Sustainable Waste Management
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', py: 4 }}>
        <Container maxWidth="md">
          <Grid container spacing={3} alignItems="center" justifyContent="center">
            {/* Right Side - Registration Form */}
            <Grid item xs={12} md={7}>
              <Card
                sx={{
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid #e0e0e0',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  {/* Form Header */}
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 55,
                        height: 55,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                        mb: 2,
                        mx: 'auto',
                      }}
                    >
                      <PersonAddIcon sx={{ fontSize: 30, color: 'white' }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: '700', mb: 0.5, color: '#1b5e20' }}>
                      Create Account
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Join the national waste management initiative
                    </Typography>
                  </Box>

                  {/* Error Alert */}
                  {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
                      {error}
                    </Alert>
                  )}

                  {/* Registration Form */}
                  <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {/* Name Field */}
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: '600', color: '#333' }}>
                          Full Name *
                        </Typography>
                        <TextField
                          fullWidth
                          name="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                              backgroundColor: '#fafafa',
                              '&:hover fieldset': {
                                borderColor: '#1b5e20',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#1b5e20',
                                borderWidth: 2,
                              },
                            },
                          }}
                        />
                      </Box>

                      {/* Email Field */}
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: '600', color: '#333' }}>
                          Email Address *
                        </Typography>
                        <TextField
                          fullWidth
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                              backgroundColor: '#fafafa',
                              '&:hover fieldset': {
                                borderColor: '#1b5e20',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#1b5e20',
                                borderWidth: 2,
                              },
                            },
                          }}
                        />
                      </Box>

                      {/* Phone Field */}
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: '600', color: '#333' }}>
                          Phone Number *
                        </Typography>
                        <TextField
                          fullWidth
                          name="phone"
                          placeholder="Your phone number"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                              backgroundColor: '#fafafa',
                              '&:hover fieldset': {
                                borderColor: '#1b5e20',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#1b5e20',
                                borderWidth: 2,
                              },
                            },
                          }}
                        />
                      </Box>

                      {/* Address Fields */}
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: '600', color: '#333' }}>
                          Street Address
                        </Typography>
                        <TextField
                          fullWidth
                          name="address.street"
                          placeholder="Street address"
                          value={formData.address.street}
                          onChange={handleChange}
                          disabled={loading}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                              backgroundColor: '#fafafa',
                              '&:hover fieldset': {
                                borderColor: '#1b5e20',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#1b5e20',
                                borderWidth: 2,
                              },
                            },
                          }}
                        />
                      </Box>

                      {/* City, State, Zip Row */}
                      <Grid container spacing={1.5}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: '600', color: '#333' }}>
                            City
                          </Typography>
                          <TextField
                            fullWidth
                            name="address.city"
                            placeholder="City"
                            value={formData.address.city}
                            onChange={handleChange}
                            disabled={loading}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 1,
                                backgroundColor: '#fafafa',
                                '&:hover fieldset': {
                                  borderColor: '#1b5e20',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#1b5e20',
                                  borderWidth: 2,
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: '600', color: '#333' }}>
                            State
                          </Typography>
                          <TextField
                            fullWidth
                            name="address.state"
                            placeholder="State"
                            value={formData.address.state}
                            onChange={handleChange}
                            disabled={loading}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 1,
                                backgroundColor: '#fafafa',
                                '&:hover fieldset': {
                                  borderColor: '#1b5e20',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#1b5e20',
                                  borderWidth: 2,
                                },
                              },
                            }}
                          />
                        </Grid>
                      </Grid>

                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: '600', color: '#333' }}>
                          Zip Code
                        </Typography>
                        <TextField
                          fullWidth
                          name="address.zipcode"
                          placeholder="Zip code"
                          value={formData.address.zipcode}
                          onChange={handleChange}
                          disabled={loading}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                              backgroundColor: '#fafafa',
                              '&:hover fieldset': {
                                borderColor: '#1b5e20',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#1b5e20',
                                borderWidth: 2,
                              },
                            },
                          }}
                        />
                      </Box>

                      {/* Password Field */}
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: '600', color: '#333' }}>
                          Password *
                        </Typography>
                        <TextField
                          fullWidth
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                              backgroundColor: '#fafafa',
                              '&:hover fieldset': {
                                borderColor: '#1b5e20',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#1b5e20',
                                borderWidth: 2,
                              },
                            },
                          }}
                        />
                      </Box>

                      {/* Confirm Password Field */}
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: '600', color: '#333' }}>
                          Confirm Password *
                        </Typography>
                        <TextField
                          fullWidth
                          name="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                              backgroundColor: '#fafafa',
                              '&:hover fieldset': {
                                borderColor: '#1b5e20',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#1b5e20',
                                borderWidth: 2,
                              },
                            },
                          }}
                        />
                      </Box>

                      {/* Register Button */}
                      <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                          mt: 2,
                          py: 1.3,
                          background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                          fontWeight: '600',
                          fontSize: '1rem',
                          borderRadius: 1,
                          textTransform: 'none',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #155724 0%, #28a745 100%)',
                            boxShadow: '0 4px 12px rgba(27, 94, 32, 0.3)',
                          },
                          '&:disabled': {
                            background: '#ccc',
                          },
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={24} sx={{ color: 'white' }} />
                        ) : (
                          'Register Account'
                        )}
                      </Button>

                      {/* Divider */}
                      <Divider sx={{ my: 1 }} />

                      {/* Login Link */}
                      <Typography variant="body2" sx={{ textAlign: 'center', color: '#666' }}>
                        Already have an account?{' '}
                        <MuiLink
                          href="/login"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate('/login');
                          }}
                          sx={{
                            color: '#1b5e20',
                            fontWeight: '600',
                            textDecoration: 'none',
                            cursor: 'pointer',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          Login here
                        </MuiLink>
                      </Typography>
                    </Box>
                  </form>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          background: '#f9f9f9',
          borderTop: '1px solid #e0e0e0',
          py: 2,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="caption" sx={{ color: '#999' }}>
            © 2026 EcoManage - National Waste Management System | Promoting Sustainable Development
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Register;

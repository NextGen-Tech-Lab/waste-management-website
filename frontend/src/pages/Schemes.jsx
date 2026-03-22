import { Box, Container, Typography, Card, CardContent, CardMedia, Grid, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Schemes = () => {
  const navigate = useNavigate();

  const schemesList = [
    {
      id: 1,
      title: 'Swachh Bharat Mission',
      description: 'A national cleanliness mission focused on solid waste management and improving sanitation across India.',
      category: 'National Program',
      benefits: ['Free waste collection', 'Community participation', 'Infrastructure development'],
      icon: '🌍',
    },
    {
      id: 2,
      title: 'Extended Producer Responsibility (EPR)',
      description: 'Producers are responsible for the entire lifecycle of their products, including end-of-life management.',
      category: 'Regulatory Framework',
      benefits: ['Reduced landfill waste', 'Recycling incentives', 'Producer accountability'],
      icon: '♻️',
    },
    {
      id: 3,
      title: 'Plastic Waste Management Rules',
      description: 'Comprehensive regulations to reduce, reuse, and recycle plastic waste across the country.',
      category: 'Environmental Policy',
      benefits: ['Ban on single-use plastics', 'Recycling targets', 'Awareness campaigns'],
      icon: '🚫',
    },
    {
      id: 4,
      title: 'Solid Waste Management Rules',
      description: 'Guidelines for proper segregation, collection, treatment, and disposal of solid waste.',
      category: 'Waste Management',
      benefits: ['Source segregation', 'Safe disposal', 'Citizen responsibility'],
      icon: '♻️',
    },
    {
      id: 5,
      title: 'Biomedical Waste Management',
      description: 'Specialized disposal procedures for medical and hospital waste to prevent health hazards.',
      category: 'Health & Safety',
      benefits: ['Safe medical waste handling', 'Infection prevention', 'Staff training'],
      icon: '🏥',
    },
    {
      id: 6,
      title: 'E-Waste Management Scheme',
      description: 'Solutions for proper collection and recycling of electronic waste to recover valuable materials.',
      category: 'Resource Recovery',
      benefits: ['Material recovery', 'Toxic reduction', 'New product creation'],
      icon: '💻',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8faf8' }}>
      {/* Hero Section */}
      <Box sx={{ background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Government Schemes & Programs
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.95, maxWidth: '600px' }}>
            Learn about various national and state-level initiatives designed to improve waste management and environmental sustainability.
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3}>
          {schemesList.map((scheme) => (
            <Grid item xs={12} sm={6} md={4} key={scheme.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)',
                    py: 4,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h2">{scheme.icon}</Typography>
                </Box>
                <CardContent sx={{ flex: 1 }}>
                  <Chip
                    label={scheme.category}
                    size="small"
                    sx={{
                      bgcolor: '#e8f5e9',
                      color: '#1b5e20',
                      fontWeight: 'bold',
                      mb: 1,
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#1b5e20' }}>
                    {scheme.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                    {scheme.description}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#2e7d32' }}>
                    Key Benefits:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {scheme.benefits.map((benefit, idx) => (
                      <Typography key={idx} variant="caption" sx={{ color: '#555' }}>
                        ✓ {benefit}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ background: '#f5f5f5', py: 4, mt: 6, borderTop: '2px solid #1b5e20' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center" sx={{ color: '#666' }}>
            © 2026 EcoManage India - Public Waste Management Portal. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Schemes;

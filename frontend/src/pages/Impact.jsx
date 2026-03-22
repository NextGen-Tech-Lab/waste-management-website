import { Box, Container, Typography, Card, CardContent, Grid, Button, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Impact = () => {
  const navigate = useNavigate();

  const impactMetrics = [
    { label: 'Waste Diverted from Landfills', value: 45, unit: 'Million Tons', icon: '📊' },
    { label: 'Communities Engaged', value: 8500, unit: '+', icon: '👥' },
    { label: 'Recycling Rate Improvement', value: 38, unit: '%', icon: '♻️' },
    { label: 'Employment Created', value: 250000, unit: '+', icon: '💼' },
  ];

  const yearlyImpact = [
    { year: '2022', percentage: 25, achievement: 'Foundation Year - Initial Implementation' },
    { year: '2023', percentage: 45, achievement: 'Expanded to 500+ Cities' },
    { year: '2024', percentage: 72, achievement: 'Major Infrastructure Expansion' },
    { year: '2025', percentage: 88, achievement: 'National Coverage Achieved' },
    { year: '2026', percentage: 95, achievement: 'Advanced Digital Integration' },
  ];

  const environmentalImpact = [
    {
      title: 'Reduced CO₂ Emissions',
      value: '12.5 Million Tons',
      description: 'Equivalent to taking 2.7 million cars off the road for a year',
      icon: '🌱',
    },
    {
      title: 'Water Conservation',
      value: '450 Billion Liters',
      description: 'Saved through recycling programs and waste reduction',
      icon: '💧',
    },
    {
      title: 'Land Preserved',
      value: '50,000+ Acres',
      description: 'Kept free from landfill usage and environmental damage',
      icon: '🌳',
    },
    {
      title: 'Non-Hazardous Waste',
      value: '99.7%',
      description: 'Safely processed and diverted from landfills',
      icon: '✅',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8faf8' }}>
      {/* Header with Navigation */}
      <Box sx={{ background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)', color: 'white', py: 3 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => navigate('/login')}
            >
              🌍 EcoManage India
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              <Typography
                variant="body1"
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => navigate('/schemes')}
              >
                Schemes
              </Typography>
              <Typography
                variant="body1"
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => navigate('/impact')}
              >
                Impact
              </Typography>
              <Typography
                variant="body1"
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => navigate('/resources')}
              >
                Resources
              </Typography>
              <Button
                variant="contained"
                sx={{ bgcolor: 'white', color: '#1b5e20', fontWeight: 'bold' }}
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box sx={{ background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Our Impact at a Glance
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.95, maxWidth: '600px' }}>
            See the measurable difference we're making in environmental conservation and waste management across India.
          </Typography>
        </Container>
      </Box>

      {/* Key Metrics */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {impactMetrics.map((metric, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card
                sx={{
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  borderTop: '4px solid #1b5e20',
                  transition: 'all 0.3s ease',
                  '&:hover': { boxShadow: '0 8px 20px rgba(0,0,0,0.15)' },
                }}
              >
                <CardContent>
                  <Typography variant="h2" sx={{ mb: 1 }}>
                    {metric.icon}
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#1b5e20', fontWeight: 'bold', mb: 1 }}>
                    {metric.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 0.5 }}>
                    {metric.unit}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555', fontWeight: 'bold' }}>
                    {metric.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Yearly Progress */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, color: '#1b5e20' }}>
            📈 Year-on-Year Progress
          </Typography>
          <Grid container spacing={3}>
            {yearlyImpact.map((item, idx) => (
              <Grid item xs={12} key={idx}>
                <Card sx={{ p: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
                      {item.year}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {item.achievement}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.percentage}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: '#e8f5e9',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'linear-gradient(90deg, #1b5e20 0%, #4caf50 100%)',
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#999', mt: 1, display: 'block' }}>
                    {item.percentage}% Complete
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Environmental Impact */}
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, color: '#1b5e20' }}>
            🌍 Environmental Impact Metrics
          </Typography>
          <Grid container spacing={3}>
            {environmentalImpact.map((impact, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #f1f8e9 0%, #e8f5e9 100%)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <CardContent>
                    <Typography variant="h2" sx={{ mb: 1 }}>
                      {impact.icon}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 1 }}>
                      {impact.title}
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#2e7d32', fontWeight: 'bold', mb: 1 }}>
                      {impact.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {impact.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
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

export default Impact;

import { Box, Container, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ToolsCalculators = () => {
  const navigate = useNavigate();

  const tools = [
    {
      id: 1,
      title: 'Carbon Footprint Calculator',
      description: 'Calculate your environmental impact based on waste generation and recycling habits.',
      icon: '🌍',
      type: 'Calculator',
      route: '/calculator/carbon-footprint',
    },
    {
      id: 2,
      title: 'Waste Reduction Tracker',
      description: 'Monitor and track your waste reduction progress over time with visual analytics.',
      icon: '📊',
      type: 'Tracking Tool',
      route: '/calculator/waste-tracker',
    },
    {
      id: 3,
      title: 'Recycling Rate Calculator',
      description: 'Evaluate and improve your recycling efficiency with detailed metrics.',
      icon: '♻️',
      type: 'Calculator',
      route: '/calculator/recycling-rate',
    },
    {
      id: 4,
      title: 'Composting Guide & Tracker',
      description: 'Learn composting methods and track your organic waste conversion.',
      icon: '🌱',
      type: 'Guide & Tool',
      route: '/calculator/composting',
    },
    {
      id: 5,
      title: 'Plastic Usage Reduction Tool',
      description: 'Calculate plastic savings and find alternatives to single-use plastics.',
      icon: '🚫',
      type: 'Reduction Tool',
      route: '/calculator/plastic-reduction',
    },
    {
      id: 6,
      title: 'Waste Segregation Assistant',
      description: 'Interactive guide to help you segregate waste correctly at home.',
      icon: '🗑️',
      type: 'Interactive Tool',
      route: '/calculator/waste-segregation',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8faf8' }}>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)', color: 'white', py: 3, position: 'sticky', top: 0, zIndex: 100 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => navigate('/resources')}
            >
              🌍 EcoManage India
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              <Button
                variant="text"
                sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                onClick={() => navigate('/schemes')}
              >
                Schemes
              </Button>
              <Button
                variant="text"
                sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                onClick={() => navigate('/impact')}
              >
                Impact
              </Button>
              <Button
                variant="text"
                sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                onClick={() => navigate('/resources')}
              >
                Resources
              </Button>
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
      <Box sx={{ background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Button
            variant="text"
            sx={{ color: 'white', mb: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
            onClick={() => navigate('/resources')}
          >
            ← Back to Resources
          </Button>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            🛠️ Tools & Calculators
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: '600px' }}>
            Use our interactive tools and calculators to measure impact, track progress, and improve waste management practices.
          </Typography>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3}>
          {tools.map((tool) => (
            <Grid item xs={12} sm={6} md={4} key={tool.id}>
              <Card
                sx={{
                  height: '100%',
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
                    background: 'linear-gradient(135deg, #fff9c4 0%, #ffe082 100%)',
                    py: 4,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h1" sx={{ fontSize: '3rem' }}>
                    {tool.icon}
                  </Typography>
                </Box>
                <CardContent>
                  <Typography variant="caption" sx={{ color: '#f57f17', fontWeight: 'bold', display: 'block', mb: 1 }}>
                    {tool.type}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 1 }}>
                    {tool.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2, lineHeight: 1.6 }}>
                    {tool.description}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ bgcolor: '#f57f17', color: 'white', fontWeight: 'bold', '&:hover': { bgcolor: '#e65100' } }}
                    onClick={() => navigate(tool.route)}
                  >
                    Launch Tool
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Info Box */}
        <Card sx={{ mt: 6, background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)', boxShadow: 'none', border: '2px solid #c8e6c9' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 1 }}>
              💡 How to Use These Tools?
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.8 }}>
              Select any tool above to get started. Most tools provide immediate results and insights. Some tools allow you to track progress over time by creating an account. All data is kept confidential and used only to generate your personalized reports.
            </Typography>
          </CardContent>
        </Card>
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

export default ToolsCalculators;

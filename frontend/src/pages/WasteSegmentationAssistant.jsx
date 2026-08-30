import { Box, Container, Typography, Card, CardContent, Button, Grid, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const WasteSegmentationAssistant = () => {
  const navigate = useNavigate();
  const [selectedWaste, setSelectedWaste] = useState([]);

  const wasteItems = {
    'Wet Waste': {
      color: '#66bb6a',
      icon: '🥬',
      items: [
        'Vegetable peels',
        'Fruit scraps',
        'Cooked food',
        'Grass clippings',
        'Leaves and flowers',
        'Meat and bones',
      ],
      disposal: 'Compost or biodegradable treatment facility',
    },
    'Dry Waste': {
      color: '#ffb74d',
      icon: '📦',
      items: [
        'Paper and cardboard',
        'Plastic bottles',
        'Glass bottles',
        'Metal cans',
        'Magazines',
        'Newspapers',
      ],
      disposal: 'Recycling center or authorized dealer',
    },
    'Hazardous Waste': {
      color: '#ef5350',
      icon: '⚠️',
      items: [
        'Batteries',
        'Light bulbs',
        'Chemical bottles',
        'Paint cans',
        'Medicines',
        'Electronics',
      ],
      disposal: 'Hazardous waste center or authorized facility',
    },
    'Construction Waste': {
      color: '#ab47bc',
      icon: '🏗️',
      items: [
        'Bricks and tiles',
        'Concrete',
        'Wood and timber',
        'Metal rods',
        'Plaster',
        'Rubble',
      ],
      disposal: 'Construction waste recycler or demolition site',
    },
  };

  const toggleWaste = (category) => {
    if (selectedWaste.includes(category)) {
      setSelectedWaste(selectedWaste.filter(w => w !== category));
    } else {
      setSelectedWaste([...selectedWaste, category]);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8faf8' }}>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)', color: 'white', py: 3, position: 'sticky', top: 0, zIndex: 100 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              🌍 EcoManage India
            </Typography>
            <Button
              variant="contained"
              sx={{ bgcolor: 'white', color: '#1b5e20', fontWeight: 'bold' }}
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box sx={{ background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Button
            variant="text"
            sx={{ color: 'white', mb: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
            onClick={() => navigate('/resources/tools-calculators')}
          >
            ← Back to Tools
          </Button>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            🗑️ Waste Segregation Assistant
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: '600px' }}>
            Learn how to segregate different types of waste correctly at the source. Proper segregation makes waste management efficient and environmentally friendly.
          </Typography>
        </Container>
      </Box>

      {/* Guide Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 4 }}>
          📋 Click on a category to learn more
        </Typography>

        <Grid container spacing={3} sx={{ mb: 6 }}>
          {Object.entries(wasteItems).map(([category, data]) => (
            <Grid item xs={12} sm={6} md={6} lg={3} key={category}>
              <Card
                onClick={() => toggleWaste(category)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: selectedWaste.includes(category) ? 'rgba(27, 94, 32, 0.1)' : 'white',
                  borderTop: `5px solid ${data.color}`,
                  boxShadow: selectedWaste.includes(category) ? '0 6px 16px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', pb: 2 }}>
                  <Typography variant="h2" sx={{ mb: 1 }}>
                    {data.icon}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: data.color }}>
                    {category}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 1 }}>
                    {data.items.length} types to remember
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Detailed Information */}
        {selectedWaste.length > 0 && (
          <Grid container spacing={3}>
            {selectedWaste.map((category) => {
              const data = wasteItems[category];
              return (
                <Grid item xs={12} key={category}>
                  <Card sx={{ background: `linear-gradient(135deg, rgba(27, 94, 32, 0.05) 0%, rgba(46, 125, 50, 0.05) 100%)`, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h2" sx={{ mr: 2 }}>
                          {data.icon}
                        </Typography>
                        <Box>
                          <Typography variant="h5" sx={{ fontWeight: 'bold', color: data.color }}>
                            {category}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            {data.disposal}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 2 }}>
                        Common Items:
                      </Typography>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                        {data.items.map((item) => (
                          <Chip
                            key={item}
                            label={item}
                            sx={{
                              backgroundColor: data.color,
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                        ))}
                      </Box>

                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 2 }}>
                        💡 Tips:
                      </Typography>

                      {category === 'Wet Waste' && (
                        <Box sx={{ fontSize: '0.95rem', color: '#333' }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>✅ Store in a separate bin</Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>✅ Drain excess water before disposal</Typography>
                          <Typography variant="body2">✅ Can be composted at home or sent to treatment facilities</Typography>
                        </Box>
                      )}

                      {category === 'Dry Waste' && (
                        <Box sx={{ fontSize: '0.95rem', color: '#333' }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>✅ Clean and flatten before recycling</Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>✅ Remove caps and labels if possible</Typography>
                          <Typography variant="body2">✅ Take to authorized recycling centers</Typography>
                        </Box>
                      )}

                      {category === 'Hazardous Waste' && (
                        <Box sx={{ fontSize: '0.95rem', color: '#333' }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>✅ Store in a separate, secure location</Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>✅ Never mix with other waste types</Typography>
                          <Typography variant="body2">✅ Always use authorized hazardous waste facilities</Typography>
                        </Box>
                      )}

                      {category === 'Construction Waste' && (
                        <Box sx={{ fontSize: '0.95rem', color: '#333' }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>✅ Segregate materials if possible</Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>✅ Contact construction waste recyclers</Typography>
                          <Typography variant="body2">✅ Many materials can be reused or recycled</Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {selectedWaste.length === 0 && (
          <Card sx={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center', py: 6 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#1b5e20', fontWeight: 'bold', mb: 1 }}>
                👆 Click on a waste category above to learn more
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Understanding waste segregation helps create a cleaner environment and makes recycling more effective.
              </Typography>
            </CardContent>
          </Card>
        )}
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

export default WasteSegmentationAssistant;

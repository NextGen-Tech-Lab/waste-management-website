import { Box, Container, Typography, Card, CardContent, TextField, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const CompostingCalculator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    greenWaste: '',
    brownWaste: '',
    daysComposting: '',
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateCompost = () => {
    const green = parseFloat(formData.greenWaste) || 0;
    const brown = parseFloat(formData.brownWaste) || 0;
    const days = parseFloat(formData.daysComposting) || 0;

    if (green <= 0 || brown <= 0) {
      alert('Please enter valid amounts');
      return;
    }

    const totalInput = green + brown;
    const compostProgress = (days / 150) * 100; // 150 days average composting time
    const estimatedCompost = totalInput * 0.4; // 40% of input becomes compost

    setResult({
      totalInput: totalInput.toFixed(2),
      ratio: (green / brown).toFixed(2),
      progress: Math.min(compostProgress, 100).toFixed(1),
      estimatedOutput: estimatedCompost.toFixed(2),
      daysRemaining: Math.max(150 - days, 0),
    });
  };

  const resetCalculator = () => {
    setFormData({ greenWaste: '', brownWaste: '', daysComposting: '' });
    setResult(null);
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
            🌱 Composting Guide & Tracker
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: '600px' }}>
            Learn composting methods and track your organic waste conversion into nutrient-rich soil amendment.
          </Typography>
        </Container>
      </Box>

      {/* Calculator Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderTop: '5px solid #1b5e20' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 3 }}>
              📊 Calculate Your Compost
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Green Waste (kg)"
                  name="greenWaste"
                  type="number"
                  value={formData.greenWaste}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  helperText="Fruit peels, grass, leaves"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': { borderColor: '#1b5e20' },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Brown Waste (kg)"
                  name="brownWaste"
                  type="number"
                  value={formData.brownWaste}
                  onChange={handleChange}
                  placeholder="e.g., 10"
                  helperText="Dry leaves, paper, cardboard"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': { borderColor: '#1b5e20' },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Days Composting"
                  name="daysComposting"
                  type="number"
                  value={formData.daysComposting}
                  onChange={handleChange}
                  placeholder="e.g., 60"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': { borderColor: '#1b5e20' },
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#1b5e20', fontWeight: 'bold', py: 1.5 }}
                onClick={calculateCompost}
              >
                Calculate
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{ borderColor: '#1b5e20', color: '#1b5e20', fontWeight: 'bold', py: 1.5 }}
                onClick={resetCalculator}
              >
                Reset
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ background: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="caption" sx={{ color: '#555', fontWeight: 'bold' }}>
                    INPUT MATERIALS
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20', mt: 2, mb: 1 }}>
                    Total: {result.totalInput} kg
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#333' }}>
                    Green to Brown Ratio: <strong>1:{result.ratio}</strong>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card sx={{ background: 'linear-gradient(135deg, #fff9c4 0%, #ffe082 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="caption" sx={{ color: '#f57f17', fontWeight: 'bold' }}>
                    COMPOSTING PROGRESS
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#f57f17', mt: 2, mb: 1 }}>
                    {result.progress}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#333' }}>
                    Days Remaining: <strong>{result.daysRemaining} days</strong>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 2 }}>
                    🌱 Estimated Output
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#333', mb: 1 }}>
                    Finished Compost: <strong>{result.estimatedOutput} kg</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mt: 2 }}>
                    Your compost will be rich in nutrients and perfect for gardening. Store in a cool, dry place until ready to use.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
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

export default CompostingCalculator;

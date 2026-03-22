import { Box, Container, Typography, Card, CardContent, TextField, Button, Grid, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const RecyclingRateCalculator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    totalWaste: '',
    recycledWaste: '',
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateRecyclingRate = () => {
    const total = parseFloat(formData.totalWaste) || 0;
    const recycled = parseFloat(formData.recycledWaste) || 0;

    if (total <= 0) {
      alert('Please enter a valid total waste amount');
      return;
    }

    if (recycled > total) {
      alert('Recycled waste cannot be more than total waste');
      return;
    }

    const rate = (recycled / total) * 100;
    const landfill = total - recycled;

    let category = '';
    let recommendation = '';
    
    if (rate < 30) {
      category = 'Below Average';
      recommendation = 'Increase recycling efforts. Start segregating waste properly at home and using local recycling centers.';
    } else if (rate < 50) {
      category = 'Average';
      recommendation = 'Good effort! Try to increase recycling to 60% by including more materials and reducing contamination.';
    } else if (rate < 75) {
      category = 'Above Average';
      recommendation = 'Excellent! You\'re doing great. Continue efforts and help educate your community.';
    } else {
      category = 'Exceptional';
      recommendation = 'Outstanding! You\'re a community leader in waste management. Keep inspiring others!';
    }

    setResult({
      rate: rate.toFixed(2),
      recycled: recycled.toFixed(2),
      landfill: landfill.toFixed(2),
      category,
      recommendation,
    });
  };

  const resetCalculator = () => {
    setFormData({
      totalWaste: '',
      recycledWaste: '',
    });
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
            ♻️ Recycling Rate Calculator
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: '600px' }}>
            Evaluate your recycling efficiency and discover how your rate compares to community standards.
          </Typography>
        </Container>
      </Box>

      {/* Calculator Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderTop: '5px solid #1b5e20' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 3 }}>
              📊 Calculate Your Rate
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Total Waste Generated (kg)"
                  name="totalWaste"
                  type="number"
                  value={formData.totalWaste}
                  onChange={handleChange}
                  placeholder="e.g., 50"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#1b5e20',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1b5e20',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Waste Recycled (kg)"
                  name="recycledWaste"
                  type="number"
                  value={formData.recycledWaste}
                  onChange={handleChange}
                  placeholder="e.g., 20"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#1b5e20',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1b5e20',
                      },
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
                onClick={calculateRecyclingRate}
              >
                Calculate Rate
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
            <Grid item xs={12}>
              <Card sx={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>
                    YOUR RECYCLING RATE
                  </Typography>
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
                      {result.rate}%
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 'bold', mt: 1 }}>
                      {result.category}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={parseFloat(result.rate)} 
                    sx={{ height: 8, borderRadius: 4, backgroundColor: '#c8e6c9', '& .MuiLinearProgress-bar': { backgroundColor: '#1b5e20' } }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card sx={{ background: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="caption" sx={{ color: '#555', fontWeight: 'bold' }}>
                    WASTE BREAKDOWN
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20', mt: 2, mb: 1 }}>
                    ♻️ Recycled
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#333', mb: 2 }}>
                    <strong>{result.recycled} kg</strong>
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d32f2f', mb: 1 }}>
                    🗑️ To Landfill
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#333' }}>
                    <strong>{result.landfill} kg</strong>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card sx={{ background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="caption" sx={{ color: '#555', fontWeight: 'bold' }}>
                    BENCHMARKS
                  </Typography>
                  <Box sx={{ fontSize: '0.9rem', color: '#333', mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>📊 Below Average: &lt;30%</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>📊 Average: 30-50%</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>📊 Above Average: 50-75%</Typography>
                    <Typography variant="body2">📊 Exceptional: 75%+</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ background: 'linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#01579b', mb: 2 }}>
                    💡 {result.category === 'Exceptional' ? '🌟' : '🎯'} Recommendation
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.8 }}>
                    {result.recommendation}
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

export default RecyclingRateCalculator;

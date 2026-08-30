import { Box, Container, Typography, Card, CardContent, TextField, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const PlasticReductionCalculator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bottlesPerWeek: '',
    bagsPerWeek: '',
    bugsPerWeek: '',
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculatePlasticUsage = () => {
    const bottles = parseFloat(formData.bottlesPerWeek) || 0;
    const bags = parseFloat(formData.bagsPerWeek) || 0;
    const cups = parseFloat(formData.bugsPerWeek) || 0;

    const weeklyItems = bottles + bags + cups;
    const yearlyItems = weeklyItems * 52;
    const yearlyCO2 = yearlyItems * 0.1; // 0.1 kg CO2 per plastic item

    setResult({
      weeklyItems: weeklyItems.toFixed(0),
      yearlyItems: yearlyItems.toFixed(0),
      yearlyCO2: yearlyCO2.toFixed(2),
      reduction25: (yearlyItems * 0.25).toFixed(0),
      reduction50: (yearlyItems * 0.50).toFixed(0),
    });
  };

  const resetCalculator = () => {
    setFormData({ bottlesPerWeek: '', bagsPerWeek: '', bugsPerWeek: '' });
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
            🚫 Plastic Usage Reduction Tool
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: '600px' }}>
            Calculate your plastic consumption and discover how much you can save by switching to sustainable alternatives.
          </Typography>
        </Container>
      </Box>

      {/* Calculator Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderTop: '5px solid #1b5e20' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 3 }}>
              📊 Track Your Plastic Usage
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Plastic Bottles Per Week"
                  name="bottlesPerWeek"
                  type="number"
                  value={formData.bottlesPerWeek}
                  onChange={handleChange}
                  placeholder="e.g., 7"
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
                  label="Plastic Bags Per Week"
                  name="bagsPerWeek"
                  type="number"
                  value={formData.bagsPerWeek}
                  onChange={handleChange}
                  placeholder="e.g., 15"
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
                  label="Plastic Cups Per Week"
                  name="bugsPerWeek"
                  type="number"
                  value={formData.bugsPerWeek}
                  onChange={handleChange}
                  placeholder="e.g., 10"
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
                onClick={calculatePlasticUsage}
              >
                Calculate Usage
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
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>
                          WEEKLY PLASTIC USAGE
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#d32f2f', my: 1 }}>
                          {result.weeklyItems}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#333' }}>
                          plastic items / week
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>
                          YEARLY PLASTIC USAGE
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#d32f2f', my: 1 }}>
                          {result.yearlyItems}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#333' }}>
                          plastic items / year
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card sx={{ background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="caption" sx={{ color: '#f57f17', fontWeight: 'bold' }}>
                    CO2 EMISSIONS
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f57f17', mt: 2 }}>
                    {result.yearlyCO2} kg/year
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card sx={{ background: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="caption" sx={{ color: '#1b5e20', fontWeight: 'bold' }}>
                    REDUCTION POTENTIAL
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#333', mt: 2, mb: 1 }}>
                    Reduce by 25%: Save <strong>{result.reduction25}</strong> items
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#333' }}>
                    Reduce by 50%: Save <strong>{result.reduction50}</strong> items
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ background: 'linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#01579b', mb: 2 }}>
                    💡 Sustainable Alternatives
                  </Typography>
                  <Box sx={{ fontSize: '0.95rem', color: '#333' }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>✅ Use reusable water bottles instead of plastic bottles</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>✅ Carry cloth bags for shopping</Typography>
                    <Typography variant="body2">✅ Use ceramic or steel cups for beverages</Typography>
                  </Box>
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

export default PlasticReductionCalculator;

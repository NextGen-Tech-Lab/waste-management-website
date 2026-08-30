import { Box, Container, Typography, Card, CardContent, TextField, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const CarbonFootprintCalculator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    wasteDailyKg: '',
    recyclingRate: '',
    compostingKg: '',
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateCarbonFootprint = () => {
    const daily = parseFloat(formData.wasteDailyKg) || 0;
    const recycling = parseFloat(formData.recyclingRate) || 0;
    const composting = parseFloat(formData.compostingKg) || 0;

    // Monthly calculations
    const monthlyWaste = daily * 30;
    const monthlyRecycled = monthlyWaste * (recycling / 100);
    const monthlyComposted = composting * 30;
    const monthlyLandfill = monthlyWaste - monthlyRecycled - monthlyComposted;

    // CO2 calculations (kg CO2 per kg waste)
    const co2PerKgLandfill = 0.5; // 0.5 kg CO2 per kg to landfill
    const co2Landfill = monthlyLandfill * co2PerKgLandfill;
    const co2Recycled = monthlyRecycled * 0.05; // 0.05 kg CO2 (lower due to recycling)
    const co2Composted = monthlyComposted * 0.02; // 0.02 kg CO2

    const totalCO2 = co2Landfill + co2Recycled + co2Composted;
    const yearlyCO2 = totalCO2 * 12;

    setResult({
      monthlyWaste: monthlyWaste.toFixed(2),
      monthlyRecycled: monthlyRecycled.toFixed(2),
      monthlyComposted: monthlyComposted.toFixed(2),
      monthlyLandfill: monthlyLandfill.toFixed(2),
      monthlyCO2: totalCO2.toFixed(2),
      yearlyCO2: yearlyCO2.toFixed(2),
      equivalent: (yearlyCO2 / 4).toFixed(2), // trees needed to offset
    });
  };

  const resetCalculator = () => {
    setFormData({
      wasteDailyKg: '',
      recyclingRate: '',
      compostingKg: '',
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
            🌍 Carbon Footprint Calculator
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: '600px' }}>
            Calculate your monthly and yearly carbon footprint from waste generation. Discover the environmental impact of your waste management habits.
          </Typography>
        </Container>
      </Box>

      {/* Calculator Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderTop: '5px solid #1b5e20' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 3 }}>
              📊 Enter Your Data
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Daily Waste Generation (kg)"
                  name="wasteDailyKg"
                  type="number"
                  value={formData.wasteDailyKg}
                  onChange={handleChange}
                  placeholder="e.g., 1.5"
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
                  label="Recycling Rate (%)"
                  name="recyclingRate"
                  type="number"
                  value={formData.recyclingRate}
                  onChange={handleChange}
                  placeholder="e.g., 40"
                  inputProps={{ min: 0, max: 100 }}
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
                  label="Composting Amount (kg/month)"
                  name="compostingKg"
                  type="number"
                  value={formData.compostingKg}
                  onChange={handleChange}
                  placeholder="e.g., 5"
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
                onClick={calculateCarbonFootprint}
              >
                Calculate Footprint
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
              <Card sx={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>
                    MONTHLY WASTE BREAKDOWN
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20', mt: 2, mb: 1 }}>
                    Total: {result.monthlyWaste} kg
                  </Typography>
                  <Box sx={{ fontSize: '0.9rem', color: '#555' }}>
                    <Typography variant="body2">♻️ Recycled: <strong>{result.monthlyRecycled} kg</strong></Typography>
                    <Typography variant="body2">🌱 Composted: <strong>{result.monthlyComposted} kg</strong></Typography>
                    <Typography variant="body2">🗑️ Landfill: <strong style={{ color: '#d32f2f' }}>{result.monthlyLandfill} kg</strong></Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card sx={{ background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>
                    CO2 EMISSIONS
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#e65100', mt: 2, mb: 1 }}>
                    Monthly: {result.monthlyCO2} kg
                  </Typography>
                  <Box sx={{ fontSize: '0.9rem', color: '#555' }}>
                    <Typography variant="body2">📅 <strong>Yearly: {result.yearlyCO2} kg CO2</strong></Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      🌳 Offset by <strong>{result.equivalent}</strong> trees/year
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ background: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 2 }}>
                    🎯 Recommendations
                  </Typography>
                  <Box sx={{ fontSize: '0.95rem', color: '#333' }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      ✅ Increase recycling to 60% to reduce yearly emissions by ~{(result.yearlyCO2 * 0.2).toFixed(1)} kg CO2
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      ✅ Add composting of 10kg/month to save ~{(10 * 30 * 0.5 * 12 * 0.48).toFixed(1)} kg CO2 annually
                    </Typography>
                    <Typography variant="body2">
                      ✅ Reduce daily waste by 25% to lower overall emissions significantly
                    </Typography>
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

export default CarbonFootprintCalculator;

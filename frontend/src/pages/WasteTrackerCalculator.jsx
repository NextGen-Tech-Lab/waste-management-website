import { Box, Container, Typography, Card, CardContent, TextField, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const WasteTrackerCalculator = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Wet Waste',
    amount: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addEntry = () => {
    if (!formData.amount) {
      alert('Please enter an amount');
      return;
    }
    setEntries([...entries, { ...formData, id: Date.now() }]);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: 'Wet Waste',
      amount: '',
    });
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const calculateStats = () => {
    const totalWaste = entries.reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
    const byCategory = {};
    entries.forEach(entry => {
      byCategory[entry.category] = (byCategory[entry.category] || 0) + parseFloat(entry.amount);
    });
    return { totalWaste, byCategory };
  };

  const stats = calculateStats();

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
            📊 Waste Reduction Tracker
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: '600px' }}>
            Track your daily waste generation and monitor your progress toward sustainability goals.
          </Typography>
        </Container>
      </Box>

      {/* Tracker Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3}>
          {/* Input Form */}
          <Grid item xs={12} md={5}>
            <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderTop: '5px solid #1b5e20' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 3 }}>
                  📝 Log Your Waste
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
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
                      select
                      label="Category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      SelectProps={{ native: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': { borderColor: '#1b5e20' },
                        },
                      }}
                    >
                      <option>Wet Waste</option>
                      <option>Dry Waste</option>
                      <option>Hazardous Waste</option>
                      <option>Construction Waste</option>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Amount (kg)"
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="e.g., 2.5"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': { borderColor: '#1b5e20' },
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{ bgcolor: '#1b5e20', fontWeight: 'bold', py: 1.5 }}
                  onClick={addEntry}
                >
                  Add Entry
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Statistics */}
          <Grid item xs={12} md={7}>
            <Card sx={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 3 }}>
                  📈 Summary
                </Typography>
                
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 1 }}>
                  {stats.totalWaste.toFixed(2)} kg
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                  Total waste tracked
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 2 }}>
                  By Category:
                </Typography>
                <Box sx={{ fontSize: '0.95rem', color: '#333' }}>
                  {Object.entries(stats.byCategory).map(([category, amount]) => (
                    <Typography key={category} variant="body2" sx={{ mb: 1 }}>
                      {category}: <strong>{amount.toFixed(2)} kg</strong>
                    </Typography>
                  ))}
                  {entries.length === 0 && (
                    <Typography variant="body2" sx={{ color: '#999', fontStyle: 'italic' }}>
                      No entries yet. Add waste entries to see statistics.
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Entries List */}
          <Grid item xs={12}>
            <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 2 }}>
                  📋 Recent Entries
                </Typography>
                {entries.length === 0 ? (
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    No entries yet. Start logging your waste!
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {entries.map((entry) => (
                      <Grid item xs={12} sm={6} md={4} key={entry.id}>
                        <Card sx={{ backgroundColor: '#f5f5f5' }}>
                          <CardContent>
                            <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                              {entry.date}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 1 }}>
                              {entry.amount} kg
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 'bold', display: 'block', mb: 2 }}>
                              {entry.category}
                            </Typography>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              fullWidth
                              onClick={() => deleteEntry(entry.id)}
                            >
                              Delete
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
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

export default WasteTrackerCalculator;

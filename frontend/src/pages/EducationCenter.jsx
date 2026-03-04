import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Chip,
} from '@mui/material';
import educationService from '../services/educationService.js';

const EducationCenter = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const data = await educationService.getContent({ published: 'true' });
      setContent(data);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (contentId) => {
    try {
      await educationService.likeContent(contentId);
      fetchContent();
    } catch (error) {
      console.error('Failed to like content:', error);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      waste_segregation: '#4caf50',
      recycling: '#2196f3',
      composting: '#8bc34a',
      environmental_impact: '#ff9800',
      general_tips: '#9c27b0',
    };
    return colors[category] || '#999';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        📚 Learn About Waste Management
      </Typography>

      {/* Filter Buttons */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Button
          variant={filter === '' ? 'contained' : 'outlined'}
          onClick={() => setFilter('')}
        >
          All
        </Button>
        <Button
          variant={filter === 'waste_segregation' ? 'contained' : 'outlined'}
          onClick={() => setFilter('waste_segregation')}
        >
          Waste Segregation
        </Button>
        <Button
          variant={filter === 'recycling' ? 'contained' : 'outlined'}
          onClick={() => setFilter('recycling')}
        >
          Recycling
        </Button>
        <Button
          variant={filter === 'composting' ? 'contained' : 'outlined'}
          onClick={() => setFilter('composting')}
        >
          Composting
        </Button>
        <Button
          variant={filter === 'environmental_impact' ? 'contained' : 'outlined'}
          onClick={() => setFilter('environmental_impact')}
        >
          Environmental Impact
        </Button>
      </Box>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {(filter ? content.filter((c) => c.category === filter) : content).map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card sx={{ boxShadow: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              {item.thumbnail && (
                <Box
                  sx={{
                    height: 200,
                    backgroundImage: `url(${item.thumbnail})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              )}
              <CardContent sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Chip
                    label={item.category.replace(/_/g, ' ')}
                    size="small"
                    sx={{ bgcolor: getCategoryColor(item.category), color: 'white' }}
                  />
                  <Chip
                    label={item.contentType}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 2, minHeight: 50 }}>
                  {item.description.substring(0, 100)}...
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, fontSize: '0.875rem' }}>
                  <span>👁️ {item.views || 0} views</span>
                  <span>❤️ {item.likes || 0} likes</span>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button fullWidth variant="contained" size="small">
                    Read More
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    onClick={() => handleLike(item._id)}
                  >
                    👍 Like
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EducationCenter;

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
  Modal,
  IconButton,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import educationService from '../services/educationService.js';

const EducationCenter = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [likedContent, setLikedContent] = useState(new Set());

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
      
      // Toggle like in local state
      const newLiked = new Set(likedContent);
      if (newLiked.has(contentId)) {
        newLiked.delete(contentId);
      } else {
        newLiked.add(contentId);
      }
      setLikedContent(newLiked);
      
      fetchContent();
    } catch (error) {
      console.error('Failed to like content:', error);
    }
  };

  const handleVideoClick = async (video) => {
    setSelectedVideo(video);
    // Increment views when video is clicked
    try {
      await educationService.getContentById(video._id);
    } catch (error) {
      console.error('Failed to update views:', error);
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
            {item.contentType === 'video' ? (
              // Video Card with Play Button
              <Card
                sx={{
                  boxShadow: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, boxShadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                {/* Video Thumbnail with Play Button */}
                <Box
                  sx={{
                    height: 220,
                    backgroundImage: `url(${item.thumbnail || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3C/svg%3E'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f0f0f0',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleVideoClick(item)}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'backgroundColor 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      },
                    }}
                  >
                    <PlayArrowIcon sx={{ fontSize: 60, color: 'white' }} />
                  </Box>
                </Box>

                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Chip
                      label={item.category.replace(/_/g, ' ')}
                      size="small"
                      sx={{ bgcolor: getCategoryColor(item.category), color: 'white' }}
                    />
                    <Chip
                      label="🎥 Video"
                      size="small"
                      variant="outlined"
                      sx={{ backgroundColor: '#e3f2fd' }}
                    />
                  </Box>

                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2, minHeight: 50, flex: 1 }}>
                    {item.description.substring(0, 100)}...
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, mb: 2, fontSize: '0.875rem', color: '#999' }}>
                    <span>👁️ {item.views || 0}</span>
                    <span>❤️ {item.likes || 0}</span>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      sx={{ bgcolor: '#1976d2' }}
                      onClick={() => handleVideoClick(item)}
                      startIcon={<PlayArrowIcon />}
                    >
                      Play
                    </Button>
                    <Tooltip title={likedContent.has(item._id) ? 'Unlike' : 'Like'}>
                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        onClick={() => handleLike(item._id)}
                        startIcon={likedContent.has(item._id) ? <FavoriteIcon sx={{ color: 'red' }} /> : <FavoriteBorderIcon />}
                      >
                        Like
                      </Button>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            ) : (
              // Article/Infographic Card
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
            )}
          </Grid>
        ))}
      </Grid>

      {/* Video Modal */}
      <Modal
        open={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '90%',
            maxWidth: 600,
            maxHeight: '90vh',
            backgroundColor: '#000',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {selectedVideo && (
            <>
              {/* Close Button */}
              <IconButton
                onClick={() => setSelectedVideo(null)}
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  zIndex: 10,
                  color: 'white',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                }}
              >
                <CloseIcon />
              </IconButton>

              {/* Video Player */}
              <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                <Box
                  component="iframe"
                  src={getVideoEmbedUrl(selectedVideo.videoURL)}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>

              {/* Video Info */}
              <Box sx={{ p: 2, color: 'white' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {selectedVideo.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc', mb: 2 }}>
                  {selectedVideo.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, fontSize: '0.875rem' }}>
                  <span>👁️ {selectedVideo.views || 0} views</span>
                  <span>❤️ {selectedVideo.likes || 0} likes</span>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

// Helper function to convert video URLs to embed URLs
const getVideoEmbedUrl = (url) => {
  if (!url) return '';
  
  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be') 
      ? url.split('youtu.be/')[1]?.split('?')[0]
      : new URLSearchParams(new URL(url).search).get('v');
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // Vimeo
  if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return `https://player.vimeo.com/video/${videoId}`;
  }
  
  // Direct video files
  return url;
};

export default EducationCenter;

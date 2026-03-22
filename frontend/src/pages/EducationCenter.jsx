import { useState, useEffect, useRef } from 'react';
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
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import educationService from '../services/educationService.js';

// Mock video data for different categories
const mockVideosByCategory = {
  waste_segregation: [
    { id: 'ws1', title: 'How to Segregate Waste at Home', duration: '12:30', thumbnail: '📋', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', views: 2500, description: 'Learn the proper way to segregate wet and dry waste at your home.' },
    { id: 'ws2', title: 'Wet Waste vs Dry Waste Explained', duration: '8:45', thumbnail: '♻️', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', views: 1800, description: 'Understand the differences between wet and dry waste.' },
    { id: 'ws3', title: 'Common Segregation Mistakes', duration: '6:20', thumbnail: '⚠️', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', views: 1200, description: 'Avoid these common mistakes when segregating waste.' },
    { id: 'ws4', title: 'Medical Waste Management', duration: '10:15', thumbnail: '🏥', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', views: 950, description: 'How to manage medical and hazardous waste safely.' },
  ],
  recycling: [
    { id: 'rc1', title: 'Introduction to Recycling', duration: '14:50', thumbnail: '♻️', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', views: 3200, description: 'Understand the basics of recycling and its importance.' },
    { id: 'rc2', title: 'Recycling Plastics - Do\'s and Don\'ts', duration: '9:30', thumbnail: '🔄', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', views: 2100, description: 'Learn which plastics can be recycled and how.' },
    { id: 'rc3', title: 'E-Waste Recycling Guide', duration: '11:20', thumbnail: '📱', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', views: 1650, description: 'Proper disposal and recycling of electronic waste.' },
    { id: 'rc4', title: 'Paper and Cardboard Recycling', duration: '7:45', thumbnail: '📰', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', views: 1400, description: 'How to recycle paper and cardboard products.' },
    { id: 'rc5', title: 'Metal Recycling Process', duration: '13:10', thumbnail: '⚙️', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', views: 1100, description: 'Understanding metal recycling and collection.' },
  ],
  composting: [
    { id: 'cm1', title: 'Home Composting Basics', duration: '15:40', thumbnail: '🌱', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', views: 2800, description: 'Start composting at home with these simple steps.' },
    { id: 'cm2', title: 'Building Your Compost Bin', duration: '12:20', thumbnail: '📦', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', views: 1900, description: 'DIY guide to building an effective compost bin.' },
    { id: 'cm3', title: 'Composting Kitchen Waste', duration: '8:50', thumbnail: '🍴', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', views: 1600, description: 'Compost your kitchen scraps effectively.' },
    { id: 'cm4', title: 'Troubleshooting Compost Problems', duration: '10:05', thumbnail: '🔧', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', views: 980, description: 'Solutions to common composting issues.' },
  ],
  environmental_impact: [
    { id: 'ei1', title: 'Impact of Plastic on Environment', duration: '16:30', thumbnail: '🌍', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', views: 3500, description: 'How plastic waste affects our environment.' },
    { id: 'ei2', title: 'Climate Change and Waste', duration: '13:45', thumbnail: '🌡️', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', views: 2200, description: 'The connection between waste management and climate.' },
    { id: 'ei3', title: 'Ocean Pollution Crisis', duration: '11:30', thumbnail: '🌊', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', views: 2900, description: 'Understanding ocean pollution from plastic waste.' },
    { id: 'ei4', title: 'Solutions for a Cleaner Future', duration: '14:20', thumbnail: '✨', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', views: 1700, description: 'Innovative solutions to reduce environmental waste impact.' },
  ],
  general_tips: [
    { id: 'gt1', title: 'Zero Waste Living Guide', duration: '18:15', thumbnail: '0️⃣', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', views: 2600, description: 'How to reduce waste and live sustainably.' },
    { id: 'gt2', title: 'Shopping Smart to Reduce Waste', duration: '9:40', thumbnail: '🛍️', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', views: 1450, description: 'Make sustainable shopping choices.' },
    { id: 'gt3', title: 'Reusing Items Creatively', duration: '10:25', thumbnail: '🎨', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', views: 1800, description: 'Creative ways to reuse everyday items.' },
  ],
};

const EducationCenter = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState(new Set());
  const scrollRef = useRef(null);

  const categories = [
    { id: 'waste_segregation', label: 'Waste Segregation', icon: '📋', color: '#4caf50' },
    { id: 'recycling', label: 'Recycling', icon: '♻️', color: '#2196f3' },
    { id: 'composting', label: 'Composting', icon: '🌱', color: '#8bc34a' },
    { id: 'environmental_impact', label: 'Environmental Impact', icon: '🌍', color: '#ff9800' },
    { id: 'general_tips', label: 'General Tips', icon: '💡', color: '#9c27b0' },
  ];

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

  const getCategoryVideos = (categoryId) => {
    return mockVideosByCategory[categoryId] || [];
  };

  const currentVideos = selectedCategory ? getCategoryVideos(selectedCategory) : [];
  const currentVideo = currentVideos[currentVideoIndex];

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentVideoIndex(0);
    setLikedVideos(new Set());
  };

  const handleVideoClick = (index) => {
    setCurrentVideoIndex(index);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const handleNextVideo = () => {
    if (currentVideoIndex < currentVideos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const handleLike = (videoId) => {
    const newLiked = new Set(likedVideos);
    if (newLiked.has(videoId)) {
      newLiked.delete(videoId);
    } else {
      newLiked.add(videoId);
    }
    setLikedVideos(newLiked);
  };

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const selectedCategoryData = categories.find((cat) => cat.id === selectedCategory);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {!selectedCategory ? (
        <>
          {/* Category Selection View */}
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
            📚 Learn About Waste Management
          </Typography>

          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <Card
                  onClick={() => handleCategorySelect(category.id)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                    borderTop: `4px solid ${category.color}`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', flex: 1 }}>
                    <Typography sx={{ fontSize: 48, mb: 2 }}>{category.icon}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      {category.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                      {getCategoryVideos(category.id).length} Videos
                    </Typography>
                    <Button variant="contained" sx={{ backgroundColor: category.color }}>
                      Start Learning
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <>
          {/* Learning Session View */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setSelectedCategory(null);
                  setCurrentVideoIndex(0);
                }}
              >
                ← Back
              </Button>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {selectedCategoryData?.icon} {selectedCategoryData?.label}
              </Typography>
              <Chip
                label={`${currentVideoIndex + 1}/${currentVideos.length}`}
                sx={{ backgroundColor: selectedCategoryData?.color, color: 'white' }}
              />
            </Box>
          </Box>

          {currentVideo && (
            <>
              {/* Video Player */}
              <Paper
                sx={{
                  mb: 4,
                  backgroundColor: '#000',
                  position: 'relative',
                  paddingBottom: '56.25%',
                  height: 0,
                  overflow: 'hidden',
                  borderRadius: 2,
                  maxWidth: '950px',
                  margin: '0 auto 32px auto',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                }}
              >
                <Box
                  component="iframe"
                  src={currentVideo.url}
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
              </Paper>

              {/* Video Info */}
              <Paper sx={{ p: 4, mb: 4, backgroundColor: '#ffffff', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1a1a1a' }}>
                      {currentVideo.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.6, fontSize: '0.95rem' }}>
                      {currentVideo.description}
                    </Typography>
                  </Box>
                  <Tooltip title={likedVideos.has(currentVideo.id) ? 'Unlike' : 'Like'}>
                    <IconButton
                      onClick={() => handleLike(currentVideo.id)}
                      sx={{
                        color: likedVideos.has(currentVideo.id) ? '#d32f2f' : '#999',
                        fontSize: 28,
                        ml: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': { color: '#d32f2f', transform: 'scale(1.1)' },
                      }}
                    >
                      {likedVideos.has(currentVideo.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ display: 'flex', gap: 4, mb: 3, fontSize: '0.9rem', color: '#666' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>⏱️</span>
                    <span>{currentVideo.duration}</span>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>👁️</span>
                    <span>{currentVideo.views.toLocaleString()} views</span>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                  <Button
                    variant="outlined"
                    disabled={currentVideoIndex === 0}
                    onClick={handlePrevVideo}
                    sx={{
                      borderRadius: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      padding: '8px 20px',
                    }}
                  >
                    ← Previous Video
                  </Button>
                  <Button
                    variant="contained"
                    disabled={currentVideoIndex === currentVideos.length - 1}
                    onClick={handleNextVideo}
                    sx={{
                      backgroundColor: selectedCategoryData?.color,
                      borderRadius: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      padding: '8px 20px',
                      '&:hover': { boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' },
                    }}
                  >
                    Next Video →
                  </Button>
                </Box>
              </Paper>

              {/* Videos List with Scrolling */}
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Related Videos in This Session
              </Typography>

              <Box sx={{ position: 'relative', mb: 4 }}>
                {/* Left Arrow */}
                {currentVideoIndex > 0 && (
                  <IconButton
                    onClick={() => handleScroll('left')}
                    sx={{
                      position: 'absolute',
                      left: -50,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 10,
                      backgroundColor: selectedCategoryData?.color,
                      color: 'white',
                      '&:hover': { backgroundColor: selectedCategoryData?.color },
                    }}
                  >
                    <ChevronLeftIcon />
                  </IconButton>
                )}

                {/* Scrollable Video List */}
                <Box
                  ref={scrollRef}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    overflowX: 'auto',
                    scrollBehavior: 'smooth',
                    pb: 2,
                    '&::-webkit-scrollbar': {
                      height: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: '#f1f1f1',
                      borderRadius: 10,
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: selectedCategoryData?.color,
                      borderRadius: 10,
                      '&:hover': {
                        backgroundColor: selectedCategoryData?.color,
                      },
                    },
                  }}
                >
                  {currentVideos.map((video, index) => (
                    <Card
                      key={video.id}
                      onClick={() => handleVideoClick(index)}
                      sx={{
                        minWidth: 280,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease 0.1s',
                        border: index === currentVideoIndex ? `3px solid ${selectedCategoryData?.color}` : '1px solid #e0e0e0',
                        backgroundColor: index === currentVideoIndex ? '#f5f5f5' : '#fff',
                        boxShadow: index === currentVideoIndex ? '0 4px 16px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0.06)',
                        '&:hover': {
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                          transform: 'translateY(-6px)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          height: 160,
                          backgroundColor: '#2a2a2a',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 64,
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        {video.thumbnail}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            },
                          }}
                        >
                          <PlayArrowIcon sx={{ fontSize: 50, color: 'white', opacity: 0.8 }} />
                        </Box>
                      </Box>
                      <CardContent sx={{ p: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 'bold',
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {video.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, fontSize: '0.75rem', color: '#999' }}>
                          <span>⏱️ {video.duration}</span>
                          <span>•</span>
                          <span>👁️ {video.views.toLocaleString()}</span>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>

                {/* Right Arrow */}
                {currentVideoIndex < currentVideos.length - 3 && (
                  <IconButton
                    onClick={() => handleScroll('right')}
                    sx={{
                      position: 'absolute',
                      right: -50,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 10,
                      backgroundColor: selectedCategoryData?.color,
                      color: 'white',
                      '&:hover': { backgroundColor: selectedCategoryData?.color },
                    }}
                  >
                    <ChevronRightIcon />
                  </IconButton>
                )}
              </Box>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default EducationCenter;

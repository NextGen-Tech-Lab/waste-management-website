import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PublishIcon from '@mui/icons-material/Publish';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import PreviewIcon from '@mui/icons-material/Preview';
import educationService from '../services/educationService.js';
import { convertToEmbedUrl } from '../utils/youtubeUtils.js';

const CATEGORIES = [
  { id: 'waste_segregation', label: 'Waste Segregation' },
  { id: 'recycling', label: 'Recycling' },
  { id: 'composting', label: 'Composting' },
  { id: 'environmental_impact', label: 'Environmental Impact' },
  { id: 'general_tips', label: 'General Tips' },
];

const AdminEducationManagement = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('waste_segregation');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'waste_segregation',
    contentType: 'video',
    videoURL: '',
    published: false,
  });

  const categories = CATEGORIES;

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      // Fetch all videos (admin can see both published and unpublished)
      const response = await educationService.getContent({ contentType: 'video' });
      setVideos(response);
      
      // Calculate stats
      const publishedCount = response.filter(v => v.published).length;
      setStats({
        total: response.length,
        published: publishedCount,
        draft: response.length - publishedCount,
      });
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      setErrorMessage('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (video = null) => {
    if (video) {
      setEditingId(video._id);
      setFormData({
        title: video.title,
        description: video.description,
        category: video.category,
        contentType: 'video',
        videoURL: video.videoURL,
        published: video.published,
      });
      setPreviewUrl(video.videoURL);
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        category: 'waste_segregation',
        contentType: 'video',
        videoURL: '',
        published: false,
      });
      setPreviewUrl(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
    setPreviewUrl(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (name === 'videoURL') {
      setPreviewUrl(convertToEmbedUrl(value));
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.description || !formData.videoURL) {
        setErrorMessage('Please fill in all required fields');
        return;
      }

      const contentData = {
        ...formData,
        videoURL: convertToEmbedUrl(formData.videoURL),
      };

      if (editingId) {
        await educationService.updateContent(editingId, contentData);
        setSuccessMessage('Video updated successfully');
      } else {
        await educationService.createContent(contentData);
        setSuccessMessage('Video added successfully');
      }

      handleCloseDialog();
      fetchVideos();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving video:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to save video');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handlePublish = async (videoId, currentPublishedStatus) => {
    try {
      await educationService.updateContent(videoId, { published: !currentPublishedStatus });
      setSuccessMessage(`Video ${currentPublishedStatus ? 'unpublished' : 'published'} successfully`);
      fetchVideos();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error publishing video:', error);
      setErrorMessage('Failed to update video status');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleDelete = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await educationService.deleteContent(videoId);
        setSuccessMessage('Video deleted successfully');
        fetchVideos();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting video:', error);
        setErrorMessage('Failed to delete video');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ fontSize: '2rem', fontWeight: 'bold', color: '#4caf50' }}>
                {stats.total}
              </Box>
              <Box sx={{ color: '#666', fontSize: '0.9rem' }}>Total Videos</Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ fontSize: '2rem', fontWeight: 'bold', color: '#2196f3' }}>
                {stats.published}
              </Box>
              <Box sx={{ color: '#666', fontSize: '0.9rem' }}>Published</Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff9800' }}>
                {stats.draft}
              </Box>
              <Box sx={{ color: '#666', fontSize: '0.9rem' }}>Draft</Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Video Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
          sx={{ mb: 2 }}
        >
          + Add YouTube Video
        </Button>
      </Box>

      {/* Videos Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell align="center"><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {videos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  No videos uploaded yet. Add your first YouTube video!
                </TableCell>
              </TableRow>
            ) : (
              videos.map((video) => {
                const categoryLabel = categories.find(c => c.id === video.category)?.label || video.category;
                return (
                  <TableRow key={video._id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                    <TableCell>{video.title}</TableCell>
                    <TableCell>{categoryLabel}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={video.published ? 'Published' : 'Draft'}
                        color={video.published ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(video)}
                        title="Edit"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handlePublish(video._id, video.published)}
                        title={video.published ? 'Unpublish' : 'Publish'}
                      >
                        {video.published ? (
                          <UnpublishedIcon fontSize="small" />
                        ) : (
                          <PublishIcon fontSize="small" />
                        )}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(video._id)}
                        title="Delete"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? 'Edit Video' : 'Add YouTube Video'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Video Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            margin="normal"
            placeholder="e.g., How to Segregate Waste at Home"
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={3}
            placeholder="Brief description of the video"
          />

          <Select
            fullWidth
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            margin="dense"
            sx={{ mt: 2, mb: 2 }}
          >
            {categories.map(cat => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.label}
              </MenuItem>
            ))}
          </Select>

          <TextField
            fullWidth
            label="YouTube URL or Video ID"
            name="videoURL"
            value={formData.videoURL}
            onChange={handleInputChange}
            margin="normal"
            placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ or just dQw4w9WgXcQ"
            helperText="Paste the full YouTube link or just the video ID"
          />

          {/* Preview */}
          {previewUrl && previewUrl.includes('youtube.com/embed') && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ fontSize: '0.9rem', color: '#666', mb: 1 }}>Preview:</Box>
              <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                  src={previewUrl}
                  title="Video preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editingId ? 'Update' : 'Add'} Video
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminEducationManagement;

import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import complaintService from '../services/complaintService.js';
import { useAuth } from '../utils/useAuth.js';

const CATEGORY_OPTIONS = [
  { value: 'technical', label: 'Technical' },
  { value: 'driver_behavior', label: 'Driver Behavior' },
  { value: 'bin_damage', label: 'Bin Damage' },
  { value: 'overflowing_bin', label: 'Overflowing Bin' },
  { value: 'missed_collection', label: 'Missed Collection' },
  { value: 'other', label: 'Other' },
];

const SEVERITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const INITIAL_FORM = {
  category: '',
  subject: '',
  description: '',
  severity: 'medium',
  location: {
    latitude: '',
    longitude: '',
  },
  attachments: [],
};

const STATUS_LABELS = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
  fixed: 'Issue Fixed',
};

const ComplaintManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, logout, user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [locationLoading, setLocationLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [decisionNote, setDecisionNote] = useState('');
  const isAdminRoute = location.pathname === '/admin/complaints';

  const handleAdminLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    fetchComplaints();

    // Keep admin and user views in sync without page refresh.
    const intervalId = window.setInterval(fetchComplaints, 10000);
    return () => window.clearInterval(intervalId);
  }, []);

  const statusCounts = useMemo(() => {
    return complaints.reduce(
      (acc, complaint) => {
        acc.total += 1;
        acc[complaint.status] = (acc[complaint.status] || 0) + 1;
        return acc;
      },
      { total: 0, pending: 0, accepted: 0, rejected: 0, fixed: 0 }
    );
  }, [complaints]);

  const fetchComplaints = async () => {
    try {
      const data = await complaintService.getComplaints();
      setComplaints(data);
    } catch (error) {
      setMessage('Failed to fetch complaints. Please try again.');
      setMessageType('error');
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenCreateDialog = () => {
    setSelectedComplaint(null);
    setDecisionNote('');
    setFormData(INITIAL_FORM);
    setOpenDialog(true);
  };

  const handleOpenAdminDialog = (complaint) => {
    setSelectedComplaint(complaint);
    setDecisionNote('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedComplaint(null);
    setDecisionNote('');
    setFormData(INITIAL_FORM);
  };

  const handleLocationChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...(prev.location || {}),
        [name]: value,
      },
    }));
  };

  const handleAutoDetectLocation = () => {
    if (!navigator.geolocation) {
      showMessage('Geolocation is not supported by your browser.', 'error');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          location: {
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
          },
        }));
        showMessage('Location auto-detected. You can still edit manually.', 'success');
        setLocationLoading(false);
      },
      () => {
        showMessage('Unable to auto-detect location. Please enter coordinates manually.', 'error');
        setLocationLoading(false);
      }
    );
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      return;
    }

    const maxAllowed = 2;
    const existing = formData.attachments || [];
    const remainingSlots = Math.max(0, maxAllowed - existing.length);

    if (remainingSlots === 0) {
      showMessage('You can upload up to 2 images only.', 'error');
      return;
    }

    const acceptedFiles = files.slice(0, remainingSlots);
    const acceptedPromises = acceptedFiles.map((file) => {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Each image must be smaller than 5MB.');
      }

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            url: reader.result,
            type: 'image',
            name: file.name,
            size: file.size,
            uploadedAt: new Date().toISOString(),
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(acceptedPromises)
      .then((newAttachments) => {
        setFormData((prev) => ({
          ...prev,
          attachments: [...(prev.attachments || []), ...newAttachments],
        }));
        showMessage('Image uploaded. Please verify using preview before submit.', 'success');
      })
      .catch((error) => {
        showMessage(error.message || 'Failed to upload image.', 'error');
      })
      .finally(() => {
        event.target.value = '';
      });
  };

  const removeAttachment = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmitComplaint = async () => {
    if (!formData.category || !formData.subject || !formData.description) {
      showMessage('Category, subject and description are required.', 'error');
      return;
    }

    const latitude = Number(formData.location?.latitude);
    const longitude = Number(formData.location?.longitude);
    const hasLatitude = formData.location?.latitude !== '' && !Number.isNaN(latitude);
    const hasLongitude = formData.location?.longitude !== '' && !Number.isNaN(longitude);

    if ((formData.location?.latitude || formData.location?.longitude) && (!hasLatitude || !hasLongitude)) {
      showMessage('Please enter valid numeric latitude and longitude.', 'error');
      return;
    }

    const payload = {
      ...formData,
      location: hasLatitude && hasLongitude ? { latitude, longitude } : null,
    };

    try {
      setSubmitting(true);
      await complaintService.createComplaint(payload);
      showMessage('Complaint submitted successfully.', 'success');
      await fetchComplaints();
      handleCloseDialog();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to submit complaint.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdminAction = async (action) => {
    if (!selectedComplaint?._id) {
      return;
    }

    try {
      setSubmitting(true);

      if (action === 'accept') {
        await complaintService.acceptComplaint(selectedComplaint._id, decisionNote);
        showMessage('Complaint accepted.', 'success');
      }

      if (action === 'reject') {
        await complaintService.rejectComplaint(selectedComplaint._id, decisionNote);
        showMessage('Complaint rejected.', 'success');
      }

      if (action === 'fix') {
        await complaintService.markComplaintFixed(selectedComplaint._id, decisionNote);
        showMessage('Complaint marked as issue fixed.', 'success');
      }

      await fetchComplaints();
      handleCloseDialog();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to update complaint.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      accepted: 'info',
      rejected: 'error',
      fixed: 'success',
    };

    return colors[status] || 'default';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'success',
      medium: 'warning',
      high: 'error',
      critical: 'error',
    };
    return colors[severity] || 'default';
  };

  const renderAttachmentPreview = (attachments = [], small = false) => {
    if (!attachments.length) {
      return <Typography variant="caption" color="text.secondary">No image</Typography>;
    }

    return (
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {attachments.map((attachment, index) => (
          <Box
            key={`${attachment.url}-${index}`}
            component="img"
            src={attachment.url}
            alt={`Attachment ${index + 1}`}
            sx={{
              width: small ? 52 : 90,
              height: small ? 52 : 90,
              borderRadius: 1,
              border: '1px solid #d7e8de',
              objectFit: 'cover',
            }}
          />
        ))}
      </Stack>
    );
  };

  if (isAdminRoute) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          background: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1b5e20' }}>EcoManage Admin</div>

          <nav style={{ display: 'flex', gap: '32px' }}>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 500,
                color: '#666',
              }}
            >
              Analytics
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 500,
                color: '#666',
              }}
            >
              Logistics
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 500,
                color: '#666',
              }}
            >
              Education
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/complaints')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 600,
                color: '#1b5e20',
                borderBottom: '3px solid #1b5e20',
                paddingBottom: '4px',
              }}
            >
              Compliance
            </button>
          </nav>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button type="button" onClick={handleAdminLogout} style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              color: '#d32f2f',
              padding: '8px 12px',
            }}>Logout</button>
            <button type="button" style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#f0f0f0',
              color: '#666',
            }}>A</button>
          </div>
        </header>

        <Container maxWidth="xl" sx={{ py: 4, flex: 1 }}>
          <Box
            sx={{
              mb: 3,
              p: 3,
              borderRadius: 2,
              color: '#ffffff',
              background: 'linear-gradient(120deg, #0f6b3d 0%, #1b8f52 100%)',
              boxShadow: '0 8px 18px rgba(14, 124, 59, 0.24)',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Complaint Command Center
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.95 }}>
              Review incoming complaints, accept or reject requests, and mark issues fixed.
            </Typography>
          </Box>

      {message && (
        <Alert severity={messageType} sx={{ mb: 3 }} onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderTop: '4px solid #1976d2' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Total</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{statusCounts.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderTop: '4px solid #ed6c02' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Pending</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{statusCounts.pending}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderTop: '4px solid #0288d1' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Accepted</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{statusCounts.accepted}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderTop: '4px solid #d32f2f' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Rejected</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{statusCounts.rejected}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderTop: '4px solid #2e7d32' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Issue Fixed</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{statusCounts.fixed}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Complaint List
        </Typography>
        {!isAdmin && (
          <Button variant="contained" onClick={handleOpenCreateDialog} sx={{ borderRadius: 2 }}>
            Raise Complaint
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #d8ebe0' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#eff8f2' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Subject</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Severity</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint._id} hover>
                <TableCell>{(complaint.complaintId || '').slice(0, 8)}</TableCell>
                <TableCell>{complaint.category}</TableCell>
                <TableCell sx={{ maxWidth: 240 }}>{complaint.subject}</TableCell>
                <TableCell>{renderAttachmentPreview(complaint.attachments || [], true)}</TableCell>
                <TableCell>
                  <Chip label={complaint.severity} size="small" color={getSeverityColor(complaint.severity)} />
                </TableCell>
                <TableCell>
                  <Chip label={STATUS_LABELS[complaint.status] || complaint.status} size="small" color={getStatusColor(complaint.status)} />
                </TableCell>
                <TableCell>{new Date(complaint.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleOpenAdminDialog(complaint)}>
                    {isAdmin ? 'Review' : 'View'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!complaints.length && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">No complaints found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          {selectedComplaint ? (isAdmin ? 'Review Complaint' : 'Complaint Details') : 'Raise New Complaint'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          {!selectedComplaint && (
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select name="category" value={formData.category} onChange={handleFormChange} label="Category">
                  {CATEGORY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField fullWidth label="Subject" name="subject" value={formData.subject} onChange={handleFormChange} />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
              />

              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select name="severity" value={formData.severity} onChange={handleFormChange} label="Severity">
                  {SEVERITY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Location</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={{ mb: 1.4 }}>
                  <Button
                    variant="outlined"
                    onClick={handleAutoDetectLocation}
                    disabled={locationLoading}
                  >
                    {locationLoading ? 'Detecting...' : 'Auto Detect Location'}
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        location: { latitude: '', longitude: '' },
                      }));
                    }}
                  >
                    Clear Coordinates
                  </Button>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <TextField
                    label="Latitude"
                    name="latitude"
                    value={formData.location?.latitude || ''}
                    onChange={handleLocationChange}
                    fullWidth
                    placeholder="e.g. 12.9716"
                  />
                  <TextField
                    label="Longitude"
                    name="longitude"
                    value={formData.location?.longitude || ''}
                    onChange={handleLocationChange}
                    fullWidth
                    placeholder="e.g. 77.5946"
                  />
                </Stack>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.8, color: 'text.secondary' }}>
                  Enter coordinates manually. Leave blank if location is unavailable.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Upload Complaint Images (up to 2)
                </Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="complaint-photo-input"
                  type="file"
                  multiple
                  onChange={handlePhotoUpload}
                />
                <label htmlFor="complaint-photo-input">
                  <Button variant="outlined" component="span">Choose Image</Button>
                </label>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.8, color: 'text.secondary' }}>
                  Preview is shown below before submit.
                </Typography>
                {!!formData.attachments?.length && (
                  <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                    {formData.attachments.map((attachment, index) => (
                      <Box key={`${attachment.url}-${index}`}>
                        <Box
                          component="img"
                          src={attachment.url}
                          alt={`Selected ${index + 1}`}
                          sx={{
                            width: 100,
                            height: 100,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid #d6e6dc',
                            display: 'block',
                          }}
                        />
                        <Button size="small" onClick={() => removeAttachment(index)} sx={{ mt: 0.4 }}>
                          Remove
                        </Button>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </Stack>
          )}

          {selectedComplaint && (
            <Stack spacing={2}>
              <Typography variant="body2"><strong>Complaint ID:</strong> {selectedComplaint.complaintId}</Typography>
              <Typography variant="body2"><strong>Subject:</strong> {selectedComplaint.subject}</Typography>
              <Typography variant="body2"><strong>Description:</strong> {selectedComplaint.description}</Typography>
              <Typography variant="body2"><strong>Category:</strong> {selectedComplaint.category}</Typography>
              <Typography variant="body2"><strong>Severity:</strong> {selectedComplaint.severity}</Typography>
              <Typography variant="body2"><strong>Status:</strong> {STATUS_LABELS[selectedComplaint.status] || selectedComplaint.status}</Typography>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Attached Image</Typography>
                {renderAttachmentPreview(selectedComplaint.attachments || [])}
              </Box>

              {selectedComplaint.decisionReason && (
                <Typography variant="body2">
                  <strong>Admin Note:</strong> {selectedComplaint.decisionReason}
                </Typography>
              )}

              {isAdmin && (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Admin Note"
                  value={decisionNote}
                  onChange={(event) => setDecisionNote(event.target.value)}
                  placeholder="Optional note for user visibility"
                />
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} disabled={submitting}>Close</Button>

          {!selectedComplaint && (
            <Button variant="contained" onClick={handleSubmitComplaint} disabled={submitting}>
              Submit Complaint
            </Button>
          )}

          {isAdmin && selectedComplaint && selectedComplaint.status === 'pending' && (
            <>
              <Button color="error" variant="outlined" onClick={() => handleAdminAction('reject')} disabled={submitting}>
                Reject Complaint
              </Button>
              <Button variant="contained" onClick={() => handleAdminAction('accept')} disabled={submitting}>
                Accept Complaint
              </Button>
            </>
          )}

          {isAdmin && selectedComplaint && selectedComplaint.status === 'accepted' && (
            <Button color="success" variant="contained" onClick={() => handleAdminAction('fix')} disabled={submitting}>
              Issue Fixed
            </Button>
          )}
        </DialogActions>
      </Dialog>
        </Container>
      </div>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          mb: 3,
          p: 3,
          borderRadius: 2,
          color: '#ffffff',
          background: 'linear-gradient(120deg, #0f6b3d 0%, #1b8f52 100%)',
          boxShadow: '0 8px 18px rgba(14, 124, 59, 0.24)',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          {isAdmin ? 'Complaint Command Center' : 'My Complaints'}
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.95 }}>
          {isAdmin
            ? 'Review incoming complaints, accept or reject requests, and mark issues fixed.'
            : 'Raise complaints with evidence and track every status update from admin.'}
        </Typography>
      </Box>

      {message && (
        <Alert severity={messageType} sx={{ mb: 3 }} onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderTop: '4px solid #1976d2' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Total</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{statusCounts.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderTop: '4px solid #ed6c02' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Pending</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{statusCounts.pending}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderTop: '4px solid #0288d1' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Accepted</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{statusCounts.accepted}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderTop: '4px solid #d32f2f' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Rejected</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{statusCounts.rejected}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ borderTop: '4px solid #2e7d32' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Issue Fixed</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{statusCounts.fixed}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Complaint List
        </Typography>
        {!isAdmin && (
          <Button variant="contained" onClick={handleOpenCreateDialog} sx={{ borderRadius: 2 }}>
            Raise Complaint
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #d8ebe0' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#eff8f2' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Subject</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Severity</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint._id} hover>
                <TableCell>{(complaint.complaintId || '').slice(0, 8)}</TableCell>
                <TableCell>{complaint.category}</TableCell>
                <TableCell sx={{ maxWidth: 240 }}>{complaint.subject}</TableCell>
                <TableCell>{renderAttachmentPreview(complaint.attachments || [], true)}</TableCell>
                <TableCell>
                  <Chip label={complaint.severity} size="small" color={getSeverityColor(complaint.severity)} />
                </TableCell>
                <TableCell>
                  <Chip label={STATUS_LABELS[complaint.status] || complaint.status} size="small" color={getStatusColor(complaint.status)} />
                </TableCell>
                <TableCell>{new Date(complaint.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleOpenAdminDialog(complaint)}>
                    {isAdmin ? 'Review' : 'View'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!complaints.length && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">No complaints found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          {selectedComplaint ? (isAdmin ? 'Review Complaint' : 'Complaint Details') : 'Raise New Complaint'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          {!selectedComplaint && (
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select name="category" value={formData.category} onChange={handleFormChange} label="Category">
                  {CATEGORY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField fullWidth label="Subject" name="subject" value={formData.subject} onChange={handleFormChange} />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
              />

              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select name="severity" value={formData.severity} onChange={handleFormChange} label="Severity">
                  {SEVERITY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Location</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={{ mb: 1.4 }}>
                  <Button
                    variant="outlined"
                    onClick={handleAutoDetectLocation}
                    disabled={locationLoading}
                  >
                    {locationLoading ? 'Detecting...' : 'Auto Detect Location'}
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        location: { latitude: '', longitude: '' },
                      }));
                    }}
                  >
                    Clear Coordinates
                  </Button>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <TextField
                    label="Latitude"
                    name="latitude"
                    value={formData.location?.latitude || ''}
                    onChange={handleLocationChange}
                    fullWidth
                    placeholder="e.g. 12.9716"
                  />
                  <TextField
                    label="Longitude"
                    name="longitude"
                    value={formData.location?.longitude || ''}
                    onChange={handleLocationChange}
                    fullWidth
                    placeholder="e.g. 77.5946"
                  />
                </Stack>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.8, color: 'text.secondary' }}>
                  Enter coordinates manually. Leave blank if location is unavailable.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Upload Complaint Images (up to 2)
                </Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="complaint-photo-input"
                  type="file"
                  multiple
                  onChange={handlePhotoUpload}
                />
                <label htmlFor="complaint-photo-input">
                  <Button variant="outlined" component="span">Choose Image</Button>
                </label>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.8, color: 'text.secondary' }}>
                  Preview is shown below before submit.
                </Typography>
                {!!formData.attachments?.length && (
                  <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                    {formData.attachments.map((attachment, index) => (
                      <Box key={`${attachment.url}-${index}`}>
                        <Box
                          component="img"
                          src={attachment.url}
                          alt={`Selected ${index + 1}`}
                          sx={{
                            width: 100,
                            height: 100,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid #d6e6dc',
                            display: 'block',
                          }}
                        />
                        <Button size="small" onClick={() => removeAttachment(index)} sx={{ mt: 0.4 }}>
                          Remove
                        </Button>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </Stack>
          )}

          {selectedComplaint && (
            <Stack spacing={2}>
              <Typography variant="body2"><strong>Complaint ID:</strong> {selectedComplaint.complaintId}</Typography>
              <Typography variant="body2"><strong>Subject:</strong> {selectedComplaint.subject}</Typography>
              <Typography variant="body2"><strong>Description:</strong> {selectedComplaint.description}</Typography>
              <Typography variant="body2"><strong>Category:</strong> {selectedComplaint.category}</Typography>
              <Typography variant="body2"><strong>Severity:</strong> {selectedComplaint.severity}</Typography>
              <Typography variant="body2"><strong>Status:</strong> {STATUS_LABELS[selectedComplaint.status] || selectedComplaint.status}</Typography>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Attached Image</Typography>
                {renderAttachmentPreview(selectedComplaint.attachments || [])}
              </Box>

              {selectedComplaint.decisionReason && (
                <Typography variant="body2">
                  <strong>Admin Note:</strong> {selectedComplaint.decisionReason}
                </Typography>
              )}

              {isAdmin && (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Admin Note"
                  value={decisionNote}
                  onChange={(event) => setDecisionNote(event.target.value)}
                  placeholder="Optional note for user visibility"
                />
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} disabled={submitting}>Close</Button>

          {!selectedComplaint && (
            <Button variant="contained" onClick={handleSubmitComplaint} disabled={submitting}>
              Submit Complaint
            </Button>
          )}

          {isAdmin && selectedComplaint && selectedComplaint.status === 'pending' && (
            <>
              <Button color="error" variant="outlined" onClick={() => handleAdminAction('reject')} disabled={submitting}>
                Reject Complaint
              </Button>
              <Button variant="contained" onClick={() => handleAdminAction('accept')} disabled={submitting}>
                Accept Complaint
              </Button>
            </>
          )}

          {isAdmin && selectedComplaint && selectedComplaint.status === 'accepted' && (
            <Button color="success" variant="contained" onClick={() => handleAdminAction('fix')} disabled={submitting}>
              Issue Fixed
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ComplaintManagement;

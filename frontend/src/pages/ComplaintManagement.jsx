import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import complaintService from '../services/complaintService.js';
import { useAuth } from '../utils/useAuth.js';

const ComplaintManagement = () => {
  const { isAdmin } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: '',
    severity: 'medium',
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const data = await complaintService.getComplaints();
      setComplaints(data);
    } catch (error) {
      setMessage('Failed to fetch complaints');
      setMessageType('error');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenDialog = (complaint = null) => {
    if (complaint) {
      setEditingComplaint(complaint);
      setFormData({ ...complaint });
    } else {
      setEditingComplaint(null);
      setFormData({
        category: '',
        subject: '',
        description: '',
        severity: 'medium',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingComplaint(null);
  };

  const handleSubmit = async () => {
    if (editingComplaint) {
      try {
        await complaintService.updateComplaintStatus(editingComplaint._id, {
          status: formData.status,
          adminNotes: formData.adminNotes,
        });
        setMessage('Complaint updated successfully');
        setMessageType('success');
        fetchComplaints();
        handleCloseDialog();
      } catch (error) {
        setMessage('Failed to update complaint');
        setMessageType('error');
      }
    } else {
      try {
        await complaintService.createComplaint(formData);
        setMessage('Complaint submitted successfully');
        setMessageType('success');
        fetchComplaints();
        handleCloseDialog();
      } catch (error) {
        setMessage('Failed to submit complaint');
        setMessageType('error');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      acknowledged: 'info',
      in_progress: 'primary',
      assigned: 'primary',
      resolved: 'success',
      closed: 'default',
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          📝 Complaints
        </Typography>
        {!isAdmin && (
          <Button variant="contained" onClick={() => handleOpenDialog()}>
            Submit New Complaint
          </Button>
        )}
      </Box>

      {message && <Alert severity={messageType} sx={{ mb: 3 }}>{message}</Alert>}

      {/* Complaints Table */}
      <TableContainer component={Card} sx={{ boxShadow: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Severity</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              {isAdmin && <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint._id} sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                <TableCell>{complaint.category}</TableCell>
                <TableCell>{complaint.subject}</TableCell>
                <TableCell>
                  <Chip label={complaint.severity} color={getSeverityColor(complaint.severity)} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={complaint.status} color={getStatusColor(complaint.status)} size="small" />
                </TableCell>
                <TableCell>{new Date(complaint.createdAt).toLocaleDateString()}</TableCell>
                {isAdmin && (
                  <TableCell>
                    <Button size="small" onClick={() => handleOpenDialog(complaint)}>
                      View/Edit
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingComplaint ? '✏️ Edit Complaint' : '📝 Submit New Complaint'}
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          {!editingComplaint ? (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  label="Category"
                >
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="driver_behavior">Driver Behavior</MenuItem>
                  <MenuItem value="bin_damage">Bin Damage</MenuItem>
                  <MenuItem value="overflowing_bin">Overflowing Bin</MenuItem>
                  <MenuItem value="missed_collection">Missed Collection</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleFormChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                margin="normal"
                multiline
                rows={4}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Severity</InputLabel>
                <Select
                  name="severity"
                  value={formData.severity}
                  onChange={handleFormChange}
                  label="Severity"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </>
          ) : (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status || ''}
                  onChange={handleFormChange}
                  label="Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="acknowledged">Acknowledged</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="assigned">Assigned</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Admin Notes"
                name="adminNotes"
                value={formData.adminNotes || ''}
                onChange={handleFormChange}
                margin="normal"
                multiline
                rows={4}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingComplaint ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ComplaintManagement;

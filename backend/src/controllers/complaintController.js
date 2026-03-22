import Complaint from '../models/Complaint.js';
import { v4 as uuidv4 } from 'uuid';

export const createComplaint = async (req, res) => {
  try {
    const { binId, vehicleId, category, subject, description, severity, location, attachments } = req.body;

    console.log('Request user:', req.user);
    console.log('Request body:', req.body);

    if (!category || !subject || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const complaintData = {
      complaintId: uuidv4(),
      userId: req.user.userId,
      category,
      subject,
      description,
      severity: severity || 'medium',
      attachments: attachments || [],
      status: 'pending',
    };

    // Only add binId and vehicleId if they exist
    if (binId) complaintData.binId = binId;
    if (vehicleId) complaintData.vehicleId = vehicleId;

    // Only add location if it's provided with valid coordinates
    if (location && location.longitude !== undefined && location.latitude !== undefined) {
      complaintData.location = {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
      };
    }

    const complaint = new Complaint(complaintData);

    console.log('Complaint object:', complaint);
    await complaint.save();
    res.status(201).json({ message: 'Complaint submitted', complaint });
  } catch (error) {
    console.error('Complaint creation error:', error);
    res.status(500).json({ message: 'Failed to create complaint', error: error.message });
  }
};

export const getComplaints = async (req, res) => {
  try {
    const { status, category, userId, severity } = req.query;
    let query = {};

    // Regular users can only see their own complaints
    if (req.user.role === 'user') {
      query.userId = req.user.userId;
    }

    if (status) query.status = status;
    if (category) query.category = category;
    if (severity) query.severity = severity;
    if (userId && req.user.role === 'admin') query.userId = userId;

    const complaints = await Complaint.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch complaints', error: error.message });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('assignedTo', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Regular users can only see their own complaints
    if (req.user.role === 'user' && complaint.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch complaint', error: error.message });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { status, assignedTo, adminNotes } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status required' });
    }

    const updateData = { status, updatedAt: new Date() };

    if (assignedTo) {
      updateData.assignedTo = assignedTo;
    }

    if (adminNotes) {
      updateData.$push = {
        adminNotes: {
          note: adminNotes,
          addedBy: req.user.userId,
          addedAt: new Date(),
        },
      };
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.status(200).json({ message: 'Complaint updated', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update complaint', error: error.message });
  }
};

export const assignComplaint = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({ message: 'Assigned staff ID required' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedTo, status: 'assigned', updatedAt: new Date() },
      { new: true }
    ).populate('assignedTo', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.status(200).json({ message: 'Complaint assigned', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign complaint', error: error.message });
  }
};

export const getComplaintAnalytics = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
    const byCategory = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const bySeverity = await Complaint.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      resolutionRate: totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(2) + '%' : '0%',
      byCategory,
      bySeverity,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};

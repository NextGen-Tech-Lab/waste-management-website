import Complaint from '../models/Complaint.js';
import { v4 as uuidv4 } from 'uuid';

const COMPLAINT_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  FIXED: 'fixed',
};

const withPopulatedRelations = (query) => {
  return query
    .populate('userId', 'name email phone')
    .populate('assignedTo', 'name email')
    .populate('statusHistory.changedBy', 'name email');
};

const normalizeAttachments = (attachments = []) => {
  if (!Array.isArray(attachments)) {
    return [];
  }

  return attachments
    .filter((attachment) => attachment && attachment.url)
    .slice(0, 2)
    .map((attachment) => ({
      url: attachment.url,
      type: 'image',
      name: attachment.name || '',
      size: attachment.size || 0,
      uploadedAt: attachment.uploadedAt ? new Date(attachment.uploadedAt) : new Date(),
    }));
};

const appendHistoryEntry = (complaint, status, changedBy, note = '') => {
  complaint.statusHistory.push({
    status,
    changedBy,
    note,
    changedAt: new Date(),
  });
};

const updateDecision = async ({ complaintId, status, adminId, note }) => {
  const complaint = await Complaint.findById(complaintId);

  if (!complaint) {
    return null;
  }

  complaint.status = status;
  complaint.decisionReason = note || '';

  if (note) {
    complaint.adminNotes.push({
      note,
      addedBy: adminId,
      addedAt: new Date(),
    });
  }

  appendHistoryEntry(complaint, status, adminId, note);
  await complaint.save();

  return await withPopulatedRelations(Complaint.findById(complaint._id));
};

export const createComplaint = async (req, res) => {
  try {
    const { binId, vehicleId, category, subject, description, severity, location, attachments } = req.body;
    const requestUserId = req.user?.userId || req.user?.id || req.user?.user_id;

    console.log('Request user:', req.user);
    console.log('Request body:', req.body);

    if (!category || !subject || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!requestUserId) {
      return res.status(401).json({ message: 'Invalid user context in token' });
    }

    const complaintData = {
      complaintId: uuidv4(),
      userId: requestUserId,
      category,
      subject,
      description,
      severity: severity || 'medium',
      attachments: normalizeAttachments(attachments),
      status: COMPLAINT_STATUSES.PENDING,
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

    const savedComplaint = await withPopulatedRelations(Complaint.findById(complaint._id));
    res.status(201).json({ message: 'Complaint submitted', complaint: savedComplaint });
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

    const complaints = await withPopulatedRelations(Complaint.find(query)).sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch complaints', error: error.message });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const complaint = await withPopulatedRelations(Complaint.findById(req.params.id));

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

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;

    if (assignedTo) {
      complaint.assignedTo = assignedTo;
    }

    if (adminNotes) {
      complaint.adminNotes.push({
        note: adminNotes,
        addedBy: req.user.userId,
        addedAt: new Date(),
      });
    }

    appendHistoryEntry(complaint, status, req.user.userId, adminNotes || 'Status updated by admin');

    await complaint.save();
    const updatedComplaint = await withPopulatedRelations(Complaint.findById(complaint._id));

    res.status(200).json({ message: 'Complaint updated', complaint: updatedComplaint });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update complaint', error: error.message });
  }
};

export const acceptComplaint = async (req, res) => {
  try {
    const { note } = req.body;
    const complaint = await updateDecision({
      complaintId: req.params.id,
      status: COMPLAINT_STATUSES.ACCEPTED,
      adminId: req.user.userId,
      note: note || 'Complaint accepted by admin',
    });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    return res.status(200).json({ message: 'Complaint accepted', complaint });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to accept complaint', error: error.message });
  }
};

export const rejectComplaint = async (req, res) => {
  try {
    const { note } = req.body;
    const complaint = await updateDecision({
      complaintId: req.params.id,
      status: COMPLAINT_STATUSES.REJECTED,
      adminId: req.user.userId,
      note: note || 'Complaint rejected by admin',
    });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    return res.status(200).json({ message: 'Complaint rejected', complaint });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to reject complaint', error: error.message });
  }
};

export const markComplaintFixed = async (req, res) => {
  try {
    const { note } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.status !== COMPLAINT_STATUSES.ACCEPTED) {
      return res.status(400).json({ message: 'Only accepted complaints can be marked fixed' });
    }

    complaint.status = COMPLAINT_STATUSES.FIXED;
    complaint.resolvedAt = new Date();

    const historyNote = note || 'Issue marked as fixed by admin';
    complaint.adminNotes.push({
      note: historyNote,
      addedBy: req.user.userId,
      addedAt: new Date(),
    });
    appendHistoryEntry(complaint, COMPLAINT_STATUSES.FIXED, req.user.userId, historyNote);

    await complaint.save();
    const updatedComplaint = await withPopulatedRelations(Complaint.findById(complaint._id));

    return res.status(200).json({ message: 'Complaint marked as fixed', complaint: updatedComplaint });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to mark complaint as fixed', error: error.message });
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
    const pendingComplaints = await Complaint.countDocuments({ status: COMPLAINT_STATUSES.PENDING });
    const acceptedComplaints = await Complaint.countDocuments({ status: COMPLAINT_STATUSES.ACCEPTED });
    const rejectedComplaints = await Complaint.countDocuments({ status: COMPLAINT_STATUSES.REJECTED });
    const fixedComplaints = await Complaint.countDocuments({ status: COMPLAINT_STATUSES.FIXED });
    const byCategory = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const bySeverity = await Complaint.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      totalComplaints,
      pendingComplaints,
      acceptedComplaints,
      rejectedComplaints,
      fixedComplaints,
      resolutionRate: totalComplaints > 0 ? ((fixedComplaints / totalComplaints) * 100).toFixed(2) + '%' : '0%',
      byCategory,
      bySeverity,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};

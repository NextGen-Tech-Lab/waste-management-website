import Bin from '../models/Bin.js';
import { v4 as uuidv4 } from 'uuid';

export const getAllBins = async (req, res) => {
  try {
    const { wasteType, status, radius, latitude, longitude } = req.query;
    let query = {};

    if (wasteType) {
      query.wasteType = wasteType;
    }
    if (status) {
      query.status = status;
    }

    let bins;
    if (latitude && longitude && radius) {
      bins = await Bin.find({
        ...query,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
            $maxDistance: parseFloat(radius) * 1000, // convert km to meters
          },
        },
      });
    } else {
      bins = await Bin.find(query);
    }

    res.status(200).json(bins);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bins', error: error.message });
  }
};

export const getBinById = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id);
    if (!bin) {
      return res.status(404).json({ message: 'Bin not found' });
    }
    res.status(200).json(bin);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bin', error: error.message });
  }
};

export const createBin = async (req, res) => {
  try {
    const { location, address, wasteType, capacity } = req.body;

    if (!location || !wasteType || !capacity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const bin = new Bin({
      binId: uuidv4(),
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
      },
      address,
      wasteType,
      capacity,
      status: 'active',
    });

    await bin.save();
    res.status(201).json({ message: 'Bin created', bin });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create bin', error: error.message });
  }
};

export const updateBin = async (req, res) => {
  try {
    const { location, address, wasteType, capacity, currentFillLevel, status } = req.body;

    const updateData = {};
    if (location) {
      updateData.location = {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
      };
    }
    if (address) updateData.address = address;
    if (wasteType) updateData.wasteType = wasteType;
    if (capacity) updateData.capacity = capacity;
    if (currentFillLevel !== undefined) updateData.currentFillLevel = currentFillLevel;
    if (status) updateData.status = status;

    const bin = await Bin.findByIdAndUpdate(
      req.params.id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!bin) {
      return res.status(404).json({ message: 'Bin not found' });
    }

    res.status(200).json({ message: 'Bin updated', bin });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update bin', error: error.message });
  }
};

export const deleteBin = async (req, res) => {
  try {
    const bin = await Bin.findByIdAndDelete(req.params.id);
    if (!bin) {
      return res.status(404).json({ message: 'Bin not found' });
    }
    res.status(200).json({ message: 'Bin deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete bin', error: error.message });
  }
};

export const getBinAnalytics = async (req, res) => {
  try {
    const totalBins = await Bin.countDocuments();
    const activeBins = await Bin.countDocuments({ status: 'active' });
    const fullBins = await Bin.countDocuments({ status: 'full' });
    const avgFillLevel = await Bin.aggregate([
      { $group: { _id: null, avgFill: { $avg: '$currentFillLevel' } } },
    ]);

    const binsNeedingCollection = await Bin.find({ currentFillLevel: { $gte: 80 } });
    const wasteTypeBreakdown = await Bin.aggregate([
      { $group: { _id: '$wasteType', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      totalBins,
      activeBins,
      fullBins,
      avgFillLevel: avgFillLevel[0]?.avgFill || 0,
      binsNeedingCollection: binsNeedingCollection.length,
      byWasteType: wasteTypeBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};

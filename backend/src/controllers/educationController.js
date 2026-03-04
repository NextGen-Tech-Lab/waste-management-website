import EducationContent from '../models/EducationContent.js';
import { v4 as uuidv4 } from 'uuid';

export const createContent = async (req, res) => {
  try {
    const { title, description, category, contentType, videoURL, articleContent, infographicURL, tags } = req.body;

    if (!title || !description || !category || !contentType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const content = new EducationContent({
      contentId: uuidv4(),
      title,
      description,
      category,
      contentType,
      videoURL: contentType === 'video' ? videoURL : undefined,
      articleContent: contentType === 'article' ? articleContent : undefined,
      infographicURL: contentType === 'infographic' ? infographicURL : undefined,
      uploadedBy: req.user.userId,
      tags: tags || [],
      published: false,
    });

    await content.save();
    res.status(201).json({ message: 'Content created', content });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create content', error: error.message });
  }
};

export const getContent = async (req, res) => {
  try {
    const { category, contentType, published } = req.query;
    let query = {};

    // Only show published content to regular users
    if (req.user.role !== 'admin') {
      query.published = true;
    }

    if (category) query.category = category;
    if (contentType) query.contentType = contentType;
    if (published !== undefined) query.published = published === 'true';

    const content = await EducationContent.find(query)
      .populate('uploadedBy', 'name email')
      .sort({ uploadDate: -1 });

    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch content', error: error.message });
  }
};

export const getContentById = async (req, res) => {
  try {
    const content = await EducationContent.findById(req.params.id).populate('uploadedBy', 'name email');

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Increment views
    content.views = (content.views || 0) + 1;
    await content.save();

    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch content', error: error.message });
  }
};

export const updateContent = async (req, res) => {
  try {
    const { title, description, category, contentType, videoURL, articleContent, infographicURL, tags, published, scheduledPublishDate } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (contentType) updateData.contentType = contentType;
    if (videoURL) updateData.videoURL = videoURL;
    if (articleContent) updateData.articleContent = articleContent;
    if (infographicURL) updateData.infographicURL = infographicURL;
    if (tags) updateData.tags = tags;
    if (published !== undefined) updateData.published = published;
    if (scheduledPublishDate) updateData.scheduledPublishDate = scheduledPublishDate;

    const content = await EducationContent.findByIdAndUpdate(
      req.params.id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.status(200).json({ message: 'Content updated', content });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update content', error: error.message });
  }
};

export const deleteContent = async (req, res) => {
  try {
    const content = await EducationContent.findByIdAndDelete(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.status(200).json({ message: 'Content deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete content', error: error.message });
  }
};

export const likeContent = async (req, res) => {
  try {
    const content = await EducationContent.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 }, updatedAt: new Date() },
      { new: true }
    );

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.status(200).json({ message: 'Content liked', likes: content.likes });
  } catch (error) {
    res.status(500).json({ message: 'Failed to like content', error: error.message });
  }
};

export const getContentAnalytics = async (req, res) => {
  try {
    const totalContent = await EducationContent.countDocuments();
    const publishedContent = await EducationContent.countDocuments({ published: true });
    const byCategory = await EducationContent.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalViews: { $sum: '$views' } } },
    ]);
    const topContent = await EducationContent.find({ published: true })
      .sort({ views: -1 })
      .limit(5)
      .select('title views likes');

    res.status(200).json({
      totalContent,
      publishedContent,
      draftContent: totalContent - publishedContent,
      byCategory,
      topContent,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};

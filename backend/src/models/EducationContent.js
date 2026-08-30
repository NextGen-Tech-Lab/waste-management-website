import mongoose from 'mongoose';

const educationContentSchema = new mongoose.Schema(
  {
    contentId: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['waste_segregation', 'recycling', 'composting', 'environmental_impact', 'general_tips'],
      required: true,
    },
    contentType: {
      type: String,
      enum: ['video', 'article', 'infographic'],
      required: true,
    },
    videoURL: {
      type: String,
      required: false,
    },
    articleContent: {
      type: String,
      required: false,
    },
    infographicURL: {
      type: String,
      required: false,
    },
    thumbnail: {
      type: String,
      required: false,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: false,
    },
    scheduledPublishDate: {
      type: Date,
      required: false,
    },
    tags: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const EducationContent = mongoose.model('EducationContent', educationContentSchema);
export default EducationContent;

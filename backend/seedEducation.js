import mongoose from 'mongoose';
import dotenv from 'dotenv';
import EducationContent from './src/models/EducationContent.js';
import User from './src/models/User.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: '.env' });

const educationVideos = [
  {
    title: 'Waste Segregation - Practical Guide for Dry and Wet Waste',
    description: 'A practical guide to separate wet, dry, and hazardous waste correctly at home.',
    category: 'waste_segregation',
    contentType: 'video',
    videoURL: 'https://www.youtube.com/watch?v=aXvIjF9DTW0',
    thumbnail: 'https://img.youtube.com/vi/aXvIjF9DTW0/maxresdefault.jpg',
  },
  {
    title: 'Entire Recycling Process Explained',
    description: 'Understand how recyclables are collected, sorted, and transformed into new products.',
    category: 'recycling',
    contentType: 'video',
    videoURL: 'https://www.youtube.com/watch?v=sIBW59swvO0',
    thumbnail: 'https://img.youtube.com/vi/sIBW59swvO0/maxresdefault.jpg',
  },
  {
    title: 'Beginner\'s Guide to Composting: Turn Scraps into Soil',
    description: 'Learn how to turn kitchen scraps and garden waste into nutrient-rich compost.',
    category: 'composting',
    contentType: 'video',
    videoURL: 'https://www.youtube.com/watch?v=6oDLTRfOrV4',
    thumbnail: 'https://img.youtube.com/vi/6oDLTRfOrV4/maxresdefault.jpg',
  },
  {
    title: 'Effective Waste Management Strategies for a Greener Future',
    description: 'See how better waste management reduces pollution and supports a circular economy.',
    category: 'environmental_impact',
    contentType: 'video',
    videoURL: 'https://www.youtube.com/watch?v=xB8MssHBFkE',
    thumbnail: 'https://img.youtube.com/vi/xB8MssHBFkE/maxresdefault.jpg',
  },
  {
    title: 'Waste Management Tips for Beginners',
    description: 'Simple daily actions that help reduce waste and improve household waste habits.',
    category: 'general_tips',
    contentType: 'video',
    videoURL: 'https://www.youtube.com/watch?v=ZtIl1o7ZoVg',
    thumbnail: 'https://img.youtube.com/vi/ZtIl1o7ZoVg/maxresdefault.jpg',
  },
];

const seedEducationDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✓ Connected to MongoDB');

    // Get the current seeded admin user to assign content.
    const admin = await User.findOne({
      email: { $in: ['meera.iyer@ecocity.in', 'admin@example.com'] },
    });
    if (!admin) {
      console.error('✗ Admin user not found. Please run seed.js first.');
      process.exit(1);
    }

    console.log('✓ Admin user found');

    // Clean existing video content so the database contains one current video per category.
    const deleteResult = await EducationContent.deleteMany({ contentType: 'video' });
    console.log(`🧹 Removed ${deleteResult.deletedCount || 0} existing video records`);

    let createdVideos = 0;
    for (const video of educationVideos) {
      const content = new EducationContent({
        contentId: uuidv4(),
        title: video.title,
        description: video.description,
        category: video.category,
        contentType: video.contentType,
        videoURL: video.videoURL,
        thumbnail: video.thumbnail,
        uploadedBy: admin._id,
        published: true,
        views: 0,
        likes: 0,
        tags: [video.category.replace(/_/g, ' ')],
      });

      await content.save();
      createdVideos++;
      console.log(`✓ Created: ${video.title}`);
    }

    console.log(`\n✓ Seeding complete! ${createdVideos} new videos added.`);
    console.log(`ℹ Total education content: ${await EducationContent.countDocuments()}`);

    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding education database:', error.message);
    process.exit(1);
  }
};

seedEducationDatabase();

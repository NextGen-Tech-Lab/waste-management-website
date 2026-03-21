import mongoose from 'mongoose';
import dotenv from 'dotenv';
import EducationContent from './src/models/EducationContent.js';
import User from './src/models/User.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: '.env' });

const educationVideos = [
  // Waste Segregation Videos
  {
    title: 'How to Segregate Waste Properly',
    description: 'Learn the basics of waste segregation - separating organic, recyclable, and hazardous waste. Proper segregation is the first step to effective waste management.',
    category: 'waste_segregation',
    contentType: 'video',
    videoURL: 'https://www.youtube.com/watch?v=wJUwcni3cAA',
    thumbnail: 'https://img.youtube.com/vi/wJUwcni3cAA/maxresdefault.jpg',
  },
  {
    title: 'Waste Segregation at Source',
    description: 'Understanding the importance of segregating waste right at the source. This video explains the three main categories: wet waste, dry waste, and hazardous waste.',
    category: 'waste_segregation',
    contentType: 'video',
    videoURL: 'https://www.youtube.com/watch?v=0TFJKFj0D3U',
    thumbnail: 'https://img.youtube.com/vi/0TFJKFj0D3U/maxresdefault.jpg',
  },
  {
    title: 'Kitchen Waste Management',
    description: 'A comprehensive guide on managing kitchen waste through proper segregation and composting methods for households.',
    category: 'waste_segregation',
    contentType: 'video',
    videoURL: 'https://www.youtube.com/watch?v=CrNMCN7C5BE',
    thumbnail: 'https://img.youtube.com/vi/CrNMCN7C5BE/maxresdefault.jpg',
  },

  // Recycling Videos
  {
    title: 'The Complete Recycling Guide',
    description: 'Discover what can and cannot be recycled. Learn about the recycling process and its environmental benefits.',
    category: 'recycling',
    contentType: 'video',
    videoURL: 'https://www.youtube.com/watch?v=P29MuWl7EHs',
    thumbnail: 'https://img.youtube.com/vi/P29MuWl7EHs/maxresdefault.jpg',
  },
  {
    title: 'Plastic Recycling: From Waste to Resources',
    description: 'Understand how plastic waste is transformed into valuable resources through recycling. Learn about single-use plastics and sustainable alternatives.',
    category: 'recycling',
    contentType: 'video',
    videoURL: 'https://www.youtube.com/watch?v=Xmvd7pXVP3I',
    thumbnail: 'https://img.youtube.com/vi/Xmvd7pXVP3I/maxresdefault.jpg',
  },
  {
    title: 'Paper and Cardboard Recycling',
    description: 'Learn about the paper recycling process and how to prepare your paper waste for recycling. Understand the impact of paper recycling on forests.',
    category: 'recycling',
    contentType: 'video',
    videoURL: 'https://www.youtube.com/watch?v=P51GbxN3wJY',
    thumbnail: 'https://img.youtube.com/vi/P51GbxN3wJY/maxresdefault.jpg',
  },
  {
    title: 'Electronic Waste (E-waste) Recycling',
    description: 'Understand the importance of recycling electronic waste and the dangers of improper e-waste disposal. Learn how to recycle your old devices responsibly.',
    category: 'recycling',
    contentType: 'video',
    videoURL: 'https://www.youtube.com/watch?v=IgKBdMPvPFc',
    thumbnail: 'https://img.youtube.com/vi/IgKBdMPvPFc/maxresdefault.jpg',
  },

  // Composting Videos
  {
    title: 'Home Composting Guide for Beginners',
    description: 'Start your composting journey with this beginner-friendly guide. Learn how to create compost from kitchen and garden waste at home.',
    category: 'composting',
    contentType: 'video',
    videoURL: 'https://www.youtube.com/watch?v=PJ1h5EuC8bE',
    thumbnail: 'https://img.youtube.com/vi/PJ1h5EuC8bE/maxresdefault.jpg',
  },
  {
    title: 'Vermicomposting: Composting with Worms',
    description: 'Discover the benefits of vermicomposting using earthworms. Learn how to set up a worm bin and create nutrient-rich compost.',
    category: 'composting',
    contentType: 'video',
    videoURL: 'https://www.youtube.com/watch?v=1lI-pEqKkBM',
    thumbnail: 'https://img.youtube.com/vi/1lI-pEqKkBM/maxresdefault.jpg',
  },
  {
    title: 'Composting Methods and Best Practices',
    description: 'Learn different composting methods including cold composting, hot composting, and bokashi composting. Understand what can and cannot be composted.',
    category: 'composting',
    contentType: 'video',
    videoURL: 'https://www.youtube.com/watch?v=xGZMJfqIpgE',
    thumbnail: 'https://img.youtube.com/vi/xGZMJfqIpgE/maxresdefault.jpg',
  },

  // Environmental Impact Videos
  {
    title: 'The Impact of Waste on Environment',
    description: 'Understand how improper waste management affects our planet, from landfills to ocean pollution. Learn why waste reduction is crucial.',
    category: 'environmental_impact',
    contentType: 'video',
    videoURL: 'https://www.youtube.com/watch?v=kKZh_FWKv3U',
    thumbnail: 'https://img.youtube.com/vi/kKZh_FWKv3U/maxresdefault.jpg',
  },
  {
    title: 'Plastic Pollution and Ocean Health',
    description: 'Explore how plastic waste ends up in our oceans and its devastating impact on marine life. Learn what you can do to reduce plastic pollution.',
    category: 'environmental_impact',
    contentType: 'video',
    videoURL: 'https://www.youtube.com/watch?v=l-3nTqAIYkc',
    thumbnail: 'https://img.youtube.com/vi/l-3nTqAIYkc/maxresdefault.jpg',
  },
  {
    title: 'Climate Change and Waste Management',
    description: 'Learn how waste management practices contribute to greenhouse gas emissions and climate change. Understand sustainable waste solutions.',
    category: 'environmental_impact',
    contentType: 'video',
    videoURL: 'https://www.youtube.com/watch?v=cJA5z0f5CnE',
    thumbnail: 'https://img.youtube.com/vi/cJA5z0f5CnE/maxresdefault.jpg',
  },
  {
    title: 'Zero Waste Lifestyle - A Path to Sustainability',
    description: 'Discover how to live a zero-waste lifestyle and reduce your environmental footprint. Learn practical tips for sustainable living.',
    category: 'environmental_impact',
    contentType: 'video',
    videoURL: 'https://www.youtube.com/watch?v=xQfLOGBmA2I',
    thumbnail: 'https://img.youtube.com/vi/xQfLOGBmA2I/maxresdefault.jpg',
  },
];

const seedEducationDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✓ Connected to MongoDB');

    // Get admin user to assign content
    const admin = await User.findOne({ email: 'admin@example.com' });
    if (!admin) {
      console.error('✗ Admin user not found. Please run seed.js first.');
      process.exit(1);
    }

    console.log('✓ Admin user found');

    // Check existing content count
    const existingCount = await EducationContent.countDocuments();
    console.log(`ℹ Existing education content: ${existingCount}`);

    // Create education content
    let createdVideos = 0;
    for (const video of educationVideos) {
      // Check if video already exists
      const exists = await EducationContent.findOne({ 
        title: video.title 
      });

      if (!exists) {
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
      } else {
        console.log(`⊘ Already exists: ${video.title}`);
      }
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

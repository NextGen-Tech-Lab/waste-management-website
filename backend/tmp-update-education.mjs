import dotenv from 'dotenv';
import mongoose from 'mongoose';
import EducationContent from './src/models/EducationContent.js';

dotenv.config({ path: '.env' });

await mongoose.connect(process.env.MONGODB_URI);
await EducationContent.updateOne(
  { title: 'Kitchen Waste Management' },
  { $set: { videoURL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' } }
);
console.log('updated');
await mongoose.disconnect();

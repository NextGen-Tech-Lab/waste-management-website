import dotenv from 'dotenv';
import mongoose from 'mongoose';
import EducationContent from './src/models/EducationContent.js';

dotenv.config({ path: '.env' });

await mongoose.connect(process.env.MONGODB_URI);
await EducationContent.updateMany({}, {
  $set: {
    videoURL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
  },
});
console.log('normalized');
await mongoose.disconnect();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: '.env' });

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✓ Connected to MongoDB');

    // Upsert admin with known credentials.
    let admin = await User.findOne({ email: 'admin@example.com' }).select('+password');
    if (!admin) {
      admin = new User({
        userId: uuidv4(),
        name: 'Admin User',
        email: 'admin@example.com',
        password: '123456',
        phone: '+1234567890',
        address: {
          street: 'Admin Building',
          city: 'Chennai',
          state: 'Tamil Nadu',
          zipcode: '600001',
        },
        role: 'admin',
      });
    } else {
      admin.name = 'Admin User';
      admin.password = '123456';
      admin.phone = '+1234567890';
      admin.address = {
        street: 'Admin Building',
        city: 'Chennai',
        state: 'Tamil Nadu',
        zipcode: '600001',
      };
      admin.role = 'admin';
    }

    await admin.save();
    console.log('✓ Admin user created successfully');
    console.log('  Email: admin@example.com');
    console.log('  Password: 123456');
    console.log('  Role: admin');

    // Upsert sample regular user with known credentials.
    let user = await User.findOne({ email: 'user@example.com' }).select('+password');
    if (!user) {
      user = new User({
        userId: uuidv4(),
        name: 'Demo User',
        email: 'user@example.com',
        password: '123456',
        phone: '+1234567891',
        address: {
          street: 'Ward 21',
          city: 'Chennai',
          state: 'Tamil Nadu',
          zipcode: '600002',
        },
        role: 'user',
      });
    } else {
      user.name = 'Demo User';
      user.password = '123456';
      user.phone = '+1234567891';
      user.address = {
        street: 'Ward 21',
        city: 'Chennai',
        state: 'Tamil Nadu',
        zipcode: '600002',
      };
      user.role = 'user';
    }

    await user.save();
    console.log('\n✓ Demo user created successfully');
    console.log('  Email: user@example.com');
    console.log('  Password: 123456');
    console.log('  Role: user');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();

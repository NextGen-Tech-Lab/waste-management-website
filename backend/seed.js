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
    let admin = await User.findOne({ email: 'meera.iyer@ecocity.in' }).select('+password');
    if (!admin) {
      admin = new User({
        userId: uuidv4(),
        name: 'Meera Iyer',
        email: 'meera.iyer@ecocity.in',
        password: '123456',
        phone: '+91 9840012345',
        address: {
          street: 'Ripon Building, Periamet',
          city: 'Chennai',
          state: 'Tamil Nadu',
          zipcode: '600001',
          country: 'India',
        },
        role: 'admin',
      });
    } else {
      admin.name = 'Meera Iyer';
      admin.password = '123456';
      admin.phone = '+91 9840012345';
      admin.address = {
        street: 'Ripon Building, Periamet',
        city: 'Chennai',
        state: 'Tamil Nadu',
        zipcode: '600001',
        country: 'India',
      };
      admin.role = 'admin';
    }

    await admin.save();
    console.log('✓ Admin user created successfully');
    console.log('  Email: meera.iyer@ecocity.in');
    console.log('  Password: 123456');
    console.log('  Role: admin');

    // Upsert sample regular user with known credentials.
    let user = await User.findOne({ email: 'arjun.krishnan@ecocity.in' }).select('+password');
    if (!user) {
      user = new User({
        userId: uuidv4(),
        name: 'Arjun Krishnan',
        email: 'arjun.krishnan@ecocity.in',
        password: '123456',
        phone: '+91 9876543210',
        address: {
          street: 'No. 18, Luz Church Road, Mylapore',
          city: 'Chennai',
          state: 'Tamil Nadu',
          zipcode: '600004',
          country: 'India',
        },
        role: 'user',
      });
    } else {
      user.name = 'Arjun Krishnan';
      user.password = '123456';
      user.phone = '+91 9876543210';
      user.address = {
        street: 'No. 18, Luz Church Road, Mylapore',
        city: 'Chennai',
        state: 'Tamil Nadu',
        zipcode: '600004',
        country: 'India',
      };
      user.role = 'user';
    }

    await user.save();
    console.log('\n✓ Demo user created successfully');
    console.log('  Email: arjun.krishnan@ecocity.in');
    console.log('  Password: 123456');
    console.log('  Role: user');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();

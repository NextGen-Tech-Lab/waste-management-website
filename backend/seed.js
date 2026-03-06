import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: '.env' });

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✓ Connected to MongoDB');

    // Check if admin user already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log('✓ Admin user already exists');
      process.exit(0);
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash('1234', salt);

    // Create admin user
    const admin = new User({
      userId: uuidv4(),
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      phone: '+1234567890',
      address: {
        street: 'Admin Building',
        city: 'Sustainability City',
        state: 'Admin State',
        zipCode: '12345',
      },
      role: 'admin',
      isVerified: true,
    });

    await admin.save();
    console.log('✓ Admin user created successfully');
    console.log('  Email: admin@example.com');
    console.log('  Password: 1234');
    console.log('  Role: admin');

    // Create sample regular user
    const salt2 = await bcryptjs.genSalt(10);
    const hashedPassword2 = await bcryptjs.hash('1234', salt2);

    const user = new User({
      userId: uuidv4(),
      name: 'Demo User',
      email: 'user@example.com',
      password: hashedPassword2,
      phone: '+1234567891',
      address: {
        street: '123 Main St',
        city: 'Green City',
        state: 'Eco State',
        zipCode: '54321',
      },
      role: 'user',
      isVerified: true,
    });

    await user.save();
    console.log('\n✓ Demo user created successfully');
    console.log('  Email: user@example.com');
    console.log('  Password: 1234');
    console.log('  Role: user');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    // Check if admin user exists
    const User = require('../models/Users');
    const adminExists = await User.findOne({ role: 'admin' });

    if (!adminExists) {
      // Create default admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD || 'admin123', salt);

      await User.create({
        name: 'Admin',
        email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com',
        passwordHash: hashedPassword,
        role: 'admin'
      });
      console.log('Default admin user created');
    }
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function resetPasswords() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/PrepmateDB');
    console.log('✅ MongoDB connected');

    // Reset admin user password
    const adminPassword = 'adminpassword';
    const adminHashed = await bcrypt.hash(adminPassword, 10);
    const adminResult = await User.findOneAndUpdate(
      { email: 'admin@gmail.com' },
      { $set: { password: adminHashed, isApproved: true } },
      { new: true }
    );
    if (adminResult) {
      console.log(`Updated admin@gmail.com password to "${adminPassword}"`);
    } else {
      console.log('admin@gmail.com not found, creating new admin user...');
      const newAdmin = new User({
        username: 'admin',
        email: 'admin@gmail.com',
        password: adminHashed,
        role: 'admin',
        isApproved: true
      });
      await newAdmin.save();
      console.log(`Created admin@gmail.com with password "${adminPassword}"`);
    }

    // Reset user password
    const userPassword = 'userpassword';
    const userHashed = await bcrypt.hash(userPassword, 10);
    const userResult = await User.findOneAndUpdate(
      { email: 'Sadhana@gmail.com' },
      { $set: { password: userHashed, isApproved: true } },
      { new: true }
    );
    if (userResult) {
      console.log(`Updated Sadhana@gmail.com password to "${userPassword}"`);
    } else {
      console.log('Sadhana@gmail.com not found, creating new user...');
      const newUser = new User({
        username: 'Sadhana',
        email: 'Sadhana@gmail.com',
        password: userHashed,
        role: 'user',
        isApproved: true
      });
      await newUser.save();
      console.log(`Created Sadhana@gmail.com with password "${userPassword}"`);
    }

  } catch (error) {
    console.error('❌ Error resetting passwords:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
  }
}

resetPasswords();

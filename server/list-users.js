const mongoose = require('mongoose');
require('dotenv').config();

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/PrepmateDB');
    console.log('✅ MongoDB connected');
    
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    
    console.log('\n👥 Total Users:', users.length);
    users.forEach((user, index) => {
      console.log(`\nUser #${index + 1}:`);
      console.log(`  ID: ${user._id}`);
      console.log(`  Username: ${user.username}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Password (hash): ${user.password}`);
      console.log(`  isApproved: ${user.isApproved}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
  }
}

listUsers();

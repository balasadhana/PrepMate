const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/PrepmateDB')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Import the Material model
const Material = require('./models/Material');

// Clean up test materials
async function cleanupTestMaterials() {
  try {
    // Remove materials with test titles
    const result = await Material.deleteMany({
      title: { $in: ['Introduction to React Hooks', 'Python Basics'] }
    });
    
    console.log(`✅ Removed ${result.deletedCount} test materials`);
    
    // Show remaining materials
    const remainingMaterials = await Material.find();
    console.log('\n📚 Remaining materials in database:');
    if (remainingMaterials.length === 0) {
      console.log('No materials found');
    } else {
      remainingMaterials.forEach((material, index) => {
        console.log(`${index + 1}. ${material.title} - ${material.subject}`);
      });
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error cleaning up materials:', error);
    mongoose.connection.close();
  }
}

// Run the function
cleanupTestMaterials();


const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/PrepmateDB')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Import the Material model
const Material = require('./models/Material');

// Sample material data
const sampleMaterial = new Material({
  title: 'Introduction to React Hooks',
  subject: 'Web Development',
  description: 'A comprehensive guide to React Hooks including useState, useEffect, and custom hooks. Perfect for beginners and intermediate developers.',
  fileUrl: '/uploads/materials/sample-react-hooks.pdf',
  fileName: 'react-hooks-guide.pdf',
  fileType: 'pdf',
  fileSize: 2048576, // 2MB
  tags: ['React', 'JavaScript', 'Frontend', 'Hooks'],
  uploadedBy: null,
  isPublic: true,
  downloadCount: 0
});

// Save the sample material
async function addSampleMaterial() {
  try {
    await sampleMaterial.save();
    console.log('✅ Sample material added successfully!');
    console.log('Material ID:', sampleMaterial._id);
    
    // Fetch and display all materials
    const materials = await Material.find();
    console.log('\n📚 All materials in database:');
    materials.forEach((material, index) => {
      console.log(`${index + 1}. ${material.title} - ${material.subject}`);
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error adding sample material:', error);
    mongoose.connection.close();
  }
}

// Run the function
addSampleMaterial();

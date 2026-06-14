const mongoose = require('mongoose');
require('dotenv').config();

async function checkDBStructure() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/PrepmateDB');
    console.log('✅ MongoDB connected');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('\n📚 Available collections:');
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    // Check data in key collections
    console.log('\n🔍 Data Overview:');
    
    // Check quizzes
    const quizCount = await db.collection('quizzes').countDocuments();
    console.log(`   📝 Quizzes: ${quizCount} documents`);
    
    // Check materials
    const materialCount = await db.collection('materials').countDocuments();
    console.log(`   📚 Materials: ${materialCount} documents`);
    
    // Check tips
    const tipCount = await db.collection('tips').countDocuments();
    console.log(`   💡 Tips: ${tipCount} documents`);
    
    // Check experiences
    const experienceCount = await db.collection('experiences').countDocuments();
    console.log(`   💬 Experiences: ${experienceCount} documents`);
    
    // Check users
    const userCount = await db.collection('users').countDocuments();
    console.log(`   👥 Users: ${userCount} documents`);
    
    // Sample data from each collection
    if (quizCount > 0) {
      const sampleQuiz = await db.collection('quizzes').findOne({});
      console.log('\n📝 Sample Quiz:', sampleQuiz.question?.substring(0, 50) + '...');
    }
    
    if (materialCount > 0) {
      const sampleMaterial = await db.collection('materials').findOne({});
      console.log('📚 Sample Material:', sampleMaterial.title || sampleMaterial.name || 'Untitled');
    }
    
    if (tipCount > 0) {
      const sampleTip = await db.collection('tips').findOne({});
      console.log('💡 Sample Tip:', sampleTip.title || sampleTip.content?.substring(0, 50) + '...');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
  }
}

checkDBStructure();

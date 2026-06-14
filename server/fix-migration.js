const mongoose = require('mongoose');
require('dotenv').config();

async function fixMigration() {
  try {
    console.log('🔧 Fixing migration issues...');
    
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/PrepmateDB');
    console.log('✅ MongoDB connected');
    
    const db = mongoose.connection.db;
    
    // Get the original question to see the correct answer
    const originalQuestion = await db.collection('questions').findOne({});
    console.log('📝 Original question correct answer:', originalQuestion.correctAnswer);
    
    // Update the migrated quiz with the correct answer
    const result = await db.collection('quizzes').updateOne(
      {},
      {
        $set: {
          correctAnswer: originalQuestion.correctAnswer,
          updatedAt: new Date()
        }
      }
    );
    
    console.log('✅ Updated quiz with correct answer');
    
    // Verify the fix
    const fixedQuiz = await db.collection('quizzes').findOne({});
    console.log('\n🔍 Fixed quiz data:');
    console.log(JSON.stringify(fixedQuiz, null, 2));
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
}

fixMigration();

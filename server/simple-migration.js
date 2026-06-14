const mongoose = require('mongoose');
require('dotenv').config();

async function migrate() {
  try {
    console.log('🔄 Starting migration...');
    
    // Wait for connection to be ready
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/PrepmateDB');
    console.log('✅ MongoDB connected');
    
    const db = mongoose.connection.db;
    const questions = await db.collection('questions').find({}).toArray();
    
    console.log(`📝 Found ${questions.length} questions`);
    
    if (questions.length === 0) {
      console.log('No questions to migrate');
      return;
    }
    
    // Show sample question
    console.log('Sample question:', JSON.stringify(questions[0], null, 2));
    
    // Clear quizzes collection
    await db.collection('quizzes').deleteMany({});
    console.log('🧹 Cleared quizzes collection');
    
    let count = 0;
    for (const q of questions) {
      try {
        // Convert options object to array
        let options = [];
        if (q.options && typeof q.options === 'object') {
          if (q.options.A) options.push(q.options.A);
          if (q.options.B) options.push(q.options.B);
          if (q.options.C) options.push(q.options.C);
          if (q.options.D) options.push(q.options.D);
        }
        
        if (options.length === 0) {
          options = ['Option A', 'Option B', 'Option C', 'Option D'];
        }
        
        // Create new quiz document
        const newQuiz = {
          question: q.question || 'Question not available',
          options: options,
          correctAnswer: q.correctAnswer || 'A',
          domain: 'Other',
          explanation: q.explanation || '',
          status: 'Active',
          createdAt: q.createdAt || new Date(),
          updatedAt: new Date()
        };
        
        await db.collection('quizzes').insertOne(newQuiz);
        count++;
        console.log(`✅ Migrated question ${count}`);
        
      } catch (err) {
        console.error(`❌ Failed to migrate:`, err.message);
      }
    }
    
    console.log(`\n🎉 Migration complete! Migrated ${count} questions`);
    
    // Verify
    const newQuizzes = await db.collection('quizzes').find({}).toArray();
    console.log(`📊 Quizzes collection now has ${newQuizzes.length} documents`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
}

migrate();

const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/PrepmateDB')
  .then(() => console.log('✅ MongoDB connected to PrepmateDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

async function checkExistingQuizzes() {
  try {
    console.log('🔍 Checking existing quiz data in PrepmateDB...\n');

    // Check if Quiz collection exists and has data
    const collections = await mongoose.connection.db.listCollections().toArray();
    const quizCollectionExists = collections.some(col => col.name === 'quizzes');
    
    if (!quizCollectionExists) {
      console.log('📝 Quiz collection does not exist yet.');
      console.log('   This means no quizzes have been created yet.');
      return;
    }

    // Check existing quiz data
    const Quiz = require('./models/Quiz');
    const existingQuizzes = await Quiz.find({});
    
    console.log(`📊 Found ${existingQuizzes.length} existing quiz(s) in PrepmateDB:\n`);
    
    if (existingQuizzes.length === 0) {
      console.log('   No quiz data found. The collection exists but is empty.');
      console.log('   You can create quizzes through the admin interface.');
    } else {
      existingQuizzes.forEach((quiz, index) => {
        console.log(`${index + 1}. Domain: ${quiz.domain}`);
        console.log(`   Question: ${quiz.question.substring(0, 80)}...`);
        console.log(`   Status: ${quiz.status || 'Not set'}`);
        console.log(`   Created: ${new Date(quiz.createdAt).toLocaleDateString()}`);
        console.log(`   ID: ${quiz._id}`);
        console.log('');
      });
    }

    // Check if there are any other quiz-related collections
    const quizRelatedCollections = collections.filter(col => 
      col.name.includes('quiz') || col.name.includes('question')
    );
    
    if (quizRelatedCollections.length > 1) {
      console.log('🔍 Other quiz-related collections found:');
      quizRelatedCollections.forEach(col => {
        if (col.name !== 'quizzes') {
          console.log(`   - ${col.name}`);
        }
      });
      console.log('');
    }

    console.log('💡 Next steps:');
    if (existingQuizzes.length === 0) {
      console.log('   1. Use the admin interface to create quiz questions');
      console.log('   2. Navigate to Admin Quiz Management page');
      console.log('   3. Fill out the quiz creation form');
    } else {
      console.log('   1. Check if existing quizzes have "Active" status');
      console.log('   2. Use admin interface to manage existing quizzes');
      console.log('   3. Test user quiz taking functionality');
    }
    console.log('   4. Ensure MongoDB connection is working');

  } catch (error) {
    console.error('❌ Error checking existing quizzes:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the check
checkExistingQuizzes();



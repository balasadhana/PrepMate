const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/PrepmateDB')
  .then(() => console.log('✅ MongoDB connected to PrepmateDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

async function migrateExistingQuestions() {
  try {
    console.log('🔄 Starting migration of existing questions to new Quiz format...\n');

    // Get the database connection
    const db = mongoose.connection.db;
    
    // Check existing questions collection
    const questionsCollection = db.collection('questions');
    const existingQuestions = await questionsCollection.find({}).toArray();
    
    console.log(`📝 Found ${existingQuestions.length} existing questions to migrate\n`);
    
    if (existingQuestions.length === 0) {
      console.log('No questions to migrate. Exiting...');
      return;
    }

    // Sample the first question to see structure
    console.log('🔍 Sample question structure:');
    console.log(JSON.stringify(existingQuestions[0], null, 2));
    console.log('');

    // Check if we need to create the Quiz model
    const Quiz = require('./models/Quiz');
    
    // Clear existing quizzes collection first
    await Quiz.deleteMany({});
    console.log('🧹 Cleared existing quizzes collection\n');

    let migratedCount = 0;
    let skippedCount = 0;

    for (const oldQuestion of existingQuestions) {
      try {
        // Extract data from old structure
        const questionText = oldQuestion.question || 'Question not available';
        const options = oldQuestion.options || {};
        const correctAnswer = oldQuestion.correctAnswer || 'A';
        const explanation = oldQuestion.explanation || '';
        const difficulty = oldQuestion.difficulty || 'Medium';
        
        // Convert options object to array
        let optionsArray = [];
        if (typeof options === 'object' && options !== null) {
          // If options is an object with A, B, C, D keys
          if (options.A && options.B && options.C && options.D) {
            optionsArray = [options.A, options.B, options.C, options.D];
          } else {
            // If options has different structure, try to extract values
            optionsArray = Object.values(options).filter(val => typeof val === 'string');
          }
        }
        
        // If we couldn't extract options, create default ones
        if (optionsArray.length === 0) {
          optionsArray = ['Option A', 'Option B', 'Option C', 'Option D'];
        }

        // Determine domain based on existing data or default
        let domain = 'Other';
        if (oldQuestion.quizId) {
          // Try to get domain from related quiz if it exists
          const quizCollection = db.collection('quizzes');
          const relatedQuiz = await quizCollection.findOne({ _id: oldQuestion.quizId });
          if (relatedQuiz && relatedQuiz.category) {
            domain = relatedQuiz.category;
          }
        }

        // Create new quiz document
        const newQuiz = new Quiz({
          question: questionText,
          options: optionsArray,
          correctAnswer: correctAnswer,
          domain: domain,
          explanation: explanation,
          status: 'Active',
          createdBy: oldQuestion.createdBy || null, // Will be set to admin if null
          createdAt: oldQuestion.createdAt || new Date(),
          updatedAt: new Date()
        });

        await newQuiz.save();
        migratedCount++;
        
        console.log(`✅ Migrated: ${questionText.substring(0, 50)}...`);
        
      } catch (error) {
        console.error(`❌ Failed to migrate question:`, error.message);
        skippedCount++;
      }
    }

    console.log('\n🎉 Migration completed!');
    console.log(`   ✅ Successfully migrated: ${migratedCount} questions`);
    console.log(`   ❌ Skipped: ${skippedCount} questions`);
    
    // Verify the migration
    const newQuizzes = await Quiz.find({});
    console.log(`\n📊 New quizzes collection now contains: ${newQuizzes.length} questions`);
    
    if (newQuizzes.length > 0) {
      console.log('\n🔍 Sample migrated quiz:');
      console.log(JSON.stringify(newQuizzes[0], null, 2));
    }

    console.log('\n💡 Next steps:');
    console.log('   1. Test the user quiz page - it should now show questions');
    console.log('   2. Check that questions display properly with options');
    console.log('   3. Verify that the quiz taking functionality works');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the migration
migrateExistingQuestions();

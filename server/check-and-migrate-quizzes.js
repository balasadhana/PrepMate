const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/PrepmateDB')
  .then(() => console.log('✅ MongoDB connected to PrepmateDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

async function checkAndMigrateQuizzes() {
  try {
    console.log('🔍 Checking existing quiz data in PrepmateDB...\n');

    // Check all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Available collections:');
    collections.forEach(col => console.log(`   - ${col.name}`));
    console.log('');

    // Check if there are old quiz structures
    const oldQuizCollection = collections.find(col => col.name === 'quizzes');
    const oldQuestionCollection = collections.find(col => col.name === 'questions');
    
    if (oldQuizCollection) {
      console.log('📝 Found old quizzes collection');
      const oldQuizzes = await mongoose.connection.db.collection('quizzes').find({}).toArray();
      console.log(`   Contains ${oldQuizzes.length} old quiz records\n`);
      
      if (oldQuizzes.length > 0) {
        console.log('🔍 Sample old quiz structure:');
        console.log(JSON.stringify(oldQuizzes[0], null, 2));
        console.log('');
      }
    }

    if (oldQuestionCollection) {
      console.log('❓ Found old questions collection');
      const oldQuestions = await mongoose.connection.db.collection('questions').find({}).toArray();
      console.log(`   Contains ${oldQuestions.length} old question records\n`);
      
      if (oldQuestions.length > 0) {
        console.log('🔍 Sample old question structure:');
        console.log(JSON.stringify(oldQuestions[0], null, 2));
        console.log('');
      }
    }

    // Check new Quiz model
    const Quiz = require('./models/Quiz');
    const newQuizzes = await Quiz.find({});
    console.log(`📊 New Quiz model contains ${newQuizzes.length} quiz(es):\n`);
    
    if (newQuizzes.length === 0) {
      console.log('   No quizzes in new format yet.');
      
      if (oldQuizzes && oldQuizzes.length > 0) {
        console.log('\n🔄 Would you like to migrate old quiz data to new format?');
        console.log('   Run: node migrate-old-quizzes.js');
      }
    } else {
      newQuizzes.forEach((quiz, index) => {
        console.log(`${index + 1}. Domain: ${quiz.domain}`);
        console.log(`   Question: ${quiz.question.substring(0, 80)}...`);
        console.log(`   Status: ${quiz.status || 'Not set'}`);
        console.log(`   Created: ${new Date(quiz.createdAt).toLocaleDateString()}`);
        console.log('');
      });
    }

    // Check if we can access the data through the API
    console.log('🌐 Testing API access...');
    try {
      const response = await fetch('http://localhost:5000/api/quizzes');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API endpoint accessible');
        console.log(`   Found ${data.count || 0} active quizzes`);
      } else {
        console.log('❌ API endpoint not accessible');
      }
    } catch (error) {
      console.log('❌ API test failed - server might not be running');
    }

    console.log('\n💡 Next steps:');
    if (newQuizzes.length === 0) {
      if (oldQuizzes && oldQuizzes.length > 0) {
        console.log('   1. Migrate existing quiz data to new format');
        console.log('   2. Or create new quizzes through admin interface');
      } else {
        console.log('   1. Create quiz questions through admin interface');
        console.log('   2. Navigate to Admin Quiz Management page');
      }
    } else {
      console.log('   1. Check if existing quizzes have "Active" status');
      console.log('   2. Use admin interface to manage existing quizzes');
      console.log('   3. Test user quiz taking functionality');
    }
    console.log('   4. Ensure MongoDB connection is working');

  } catch (error) {
    console.error('❌ Error checking quizzes:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the check
checkAndMigrateQuizzes();

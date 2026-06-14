const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const tipsRoutes = require('./routes/tips');
const experiencesRoutes = require('./routes/experiences');
const resumesPublicRoutes = require('./routes/resumesPublic');
const materialsRoutes = require('./routes/materials');
const quizRoutes = require('./routes/quizzes');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Auth Routes
app.use('/api/auth', authRoutes);  // This makes /api/auth/signup available
app.use('/api/admin', adminRoutes);  //admin routes
app.use('/api/user', userRoutes);  //user routes
app.use('/api/tips', tipsRoutes);   // public tips routes
app.use('/api/experiences', experiencesRoutes); // user shared experiences
app.use('/api/resumes', resumesPublicRoutes); // public resumes save/fetch
app.use('/api/materials', materialsRoutes); // study materials routes
app.use('/api/quizzes', quizRoutes); // quiz routes

// Serve uploaded files
app.use('/uploads', express.static('uploads'));


// MongoDB Connection - connect to PrepmateDB explicitly if DB name not given
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/PrepmateDB')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});

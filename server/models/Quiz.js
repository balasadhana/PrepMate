const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  question: { 
    type: String, 
    required: true,
    trim: true
  },
  options: [{ 
    type: String, 
    required: true,
    trim: true 
  }],
  correctAnswer: { 
    type: String, 
    required: true,
    trim: true
  },
  domain: { 
    type: String, 
    required: true,
    enum: ['DBMS', 'DSA', 'Frontend', 'Backend', 'System Design', 'Other'],
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field before saving
quizSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add index for better query performance
quizSchema.index({ domain: 1 });
quizSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Quiz', quizSchema); 
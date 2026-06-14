const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  question: { 
    type: String, 
    required: true,
    trim: true
  },
  options: {
    A: { type: String, required: true, trim: true },
    B: { type: String, required: true, trim: true },
    C: { type: String, required: true, trim: true },
    D: { type: String, required: true, trim: true }
  },
  correctAnswer: { 
    type: String, 
    required: true,
    enum: ['A', 'B', 'C', 'D']
  },
  explanation: { 
    type: String, 
    trim: true
  },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  points: { 
    type: Number, 
    default: 1
  },
  order: { 
    type: Number, 
    default: 0
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Add index for better query performance
questionSchema.index({ quizId: 1, order: 1 });
questionSchema.index({ difficulty: 1 });

module.exports = mongoose.model('Question', questionSchema);

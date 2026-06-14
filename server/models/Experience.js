const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  company: { 
    type: String, 
    required: true,
    trim: true
  },
  position: { 
    type: String, 
    required: true,
    trim: true
  },
  experience: { 
    type: String, 
    required: true,
    trim: true
  },
  interviewType: { 
    type: String, 
    required: true,
    enum: ['Online', 'Offline', 'Hybrid'],
    trim: true
  },
  difficulty: { 
    type: String, 
    required: true,
    enum: ['Easy', 'Medium', 'Hard'],
    trim: true
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  tags: [{ 
    type: String, 
    trim: true 
  }],
  status: { 
    type: String, 
    required: true,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  approvedAt: { 
    type: Date 
  },
  rejectionReason: { 
    type: String, 
    trim: true 
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
experienceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add indexes for better query performance
experienceSchema.index({ status: 1, createdAt: -1 });
experienceSchema.index({ company: 1 });
experienceSchema.index({ position: 1 });
experienceSchema.index({ tags: 1 });

module.exports = mongoose.model('Experience', experienceSchema); 
const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'ResumeTemplate', required: true },
  personalInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: String,
    linkedin: String,
    website: String
  },
  education: [{
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: String,
    startDate: Date,
    endDate: Date,
    gpa: String,
    description: String
  }],
  experience: [{
    company: { type: String, required: true },
    position: { type: String, required: true },
    startDate: Date,
    endDate: Date,
    current: { type: Boolean, default: false },
    description: String,
    achievements: [String]
  }],
  skills: [{
    category: String,
    skills: [String]
  }],
  projects: [{
    title: { type: String, required: true },
    description: String,
    technologies: [String],
    link: String,
    startDate: Date,
    endDate: Date
  }],
  certifications: [{
    name: { type: String, required: true },
    issuer: String,
    date: Date,
    link: String
  }],
  languages: [{
    language: String,
    proficiency: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
resumeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Resume', resumeSchema); 
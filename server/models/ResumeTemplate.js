const mongoose = require('mongoose');

const resumeTemplateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  tags: [String],
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ResumeTemplate', resumeTemplateSchema);

const mongoose = require('mongoose');

const resumePublicSchema = new mongoose.Schema({
  personalDetails: {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, trim: true }
  },
  education: [
    {
      school: { type: String, trim: true },
      degree: { type: String, trim: true },
      year: { type: String, trim: true }
    }
  ],
  experience: [
    {
      company: { type: String, trim: true },
      role: { type: String, trim: true },
      duration: { type: String, trim: true },
      description: { type: String, trim: true }
    }
  ],
  skills: [{ type: String, trim: true }],
  projects: [
    {
      title: { type: String, trim: true },
      description: { type: String, trim: true }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ResumePublic', resumePublicSchema);



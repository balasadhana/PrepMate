const mongoose = require('mongoose');

// This model targets the existing 'experiences' collection
// to avoid clashing with the existing Experience model while
// supporting a simpler user-submitted schema.
const sharedExperienceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    experience: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'experiences'
  }
);

sharedExperienceSchema.index({ date: -1, company: 1, role: 1 });

module.exports = mongoose.model('SharedExperience', sharedExperienceSchema);



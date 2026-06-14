const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  // Optional category for future filtering in UI/Admin. Not mandatory.
  category: {
    type: String,
    trim: true
  },
  // Required: who created the tip (admin username)
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  // Required: when the tip was created
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Backwards compatibility with existing code that references `uploadedAt`
  uploadedAt: {
    type: Date
  }
});

// Keep `uploadedAt` in sync for old code paths if not provided
tipSchema.pre('save', function syncUploadedAt(next) {
  if (!this.uploadedAt) {
    this.uploadedAt = this.createdAt || new Date();
  }
  next();
});

// Helpful index for sorting/filtering
tipSchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.model('Tip', tipSchema);


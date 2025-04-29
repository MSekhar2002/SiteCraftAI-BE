//Design.js
const mongoose = require('mongoose');

const DesignSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.Mixed,
    ref: 'User',
    required: true
  },
  prompt: {
    type: String,
    required: [true, 'Design prompt is required']
  },
  generatedHTML: {
    type: String,
    default: null
  },
  generatedCSS: {
    type: String,
    default: null
  },
  previewImage: {
    type: String,
    default: null
  },
  deviceMode: {
    type: String,
    enum: ['mobile', 'tablet', 'desktop'],
    default: 'desktop'
  },
  status: {
    type: String,
    enum: ['draft', 'generated', 'saved', 'deployed'],
    default: 'draft'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Design = mongoose.model('Design', DesignSchema);
module.exports = Design;
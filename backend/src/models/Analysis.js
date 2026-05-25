const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  summary: String,
  insights: [String],
  keywords: [String],
  entities: [Object],
  sentiment: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analysis', AnalysisSchema);

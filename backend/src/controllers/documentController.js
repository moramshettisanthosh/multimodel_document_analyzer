const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');
const Analysis = require('../models/Analysis');
const ocrService = require('../services/ocrService');
const aiService = require('../services/aiService');

exports.uploadDocument = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });
    const doc = new Document({
      user: req.userId,
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size
    });
    await doc.save();
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

exports.listDocuments = async (req, res, next) => {
  try {
    const docs = await Document.find({ user: req.userId }).sort({ createdAt: -1 }).limit(50);
    res.json(docs);
  } catch (err) { next(err); }
};

exports.getDocumentDetails = async (req, res, next) => {
  try {
    const id = req.params.id;
    const doc = await Document.findOne({ _id: id, user: req.userId });
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const analysis = await Analysis.findOne({ document: doc._id, user: req.userId });
    res.json({ doc, analysis });
  } catch (err) { next(err); }
};

exports.analyzeDocument = async (req, res, next) => {
  try {
    const id = req.params.id;
    const doc = await Document.findOne({ _id: id, user: req.userId });
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const filePath = `uploads/${doc.filename}`;
    let text = doc.text || '';
    if (!text && fs.existsSync(filePath)) {
      // Try to extract text from various file types
      const ext = path.extname(doc.originalName || '').toLowerCase();
      
      // For plain text files, read directly
      if (ext === '.txt' || ext === '.md') {
        try {
          text = await fs.promises.readFile(filePath, 'utf8');
        } catch (readErr) {
          console.error('Failed to read text file:', readErr && readErr.stack ? readErr.stack : readErr);
          text = '';
        }
      } else {
        // Try OCR for other file types (images, PDFs, docx, etc.)
        try {
          text = await ocrService.extractText(filePath);
        } catch (ocrErr) {
          console.error('OCR extraction failed:', ocrErr && ocrErr.stack ? ocrErr.stack : ocrErr);
          text = '';
        }
      }
      
      doc.text = text;
      await doc.save();
    }

    // Generate analysis with fallback
    let summary = '';
    let insights = [];
    let metadata = {};

    if (text && text.trim().length > 0) {
      // If text was extracted, generate AI summary and insights
      try {
        summary = await aiService.summarizeText(text);
        insights = await aiService.extractInsights(text);
      } catch (aiErr) {
        console.error('AI service error:', aiErr && aiErr.stack ? aiErr.stack : aiErr);
        // Use fallback summaries if AI fails
        summary = aiService.simpleSummaryFromText ? aiService.simpleSummaryFromText(text) : '- Document content extracted\n- Ready for analysis';
        insights = aiService.simpleInsightsFromText ? aiService.simpleInsightsFromText(text) : ['Document loaded', 'Text available for chat'];
      }
    } else {
      // No text extracted - provide helpful feedback
      metadata.note = 'No text extracted. The file may be image-only or encrypted. You can still chat about this document.';
      summary = 'Document uploaded but text could not be extracted.';
      insights = ['Document ready for upload', 'Try asking questions in the chat'];
    }

    const analysis = new Analysis({ document: doc._id, user: req.userId, summary, insights, metadata });
    await analysis.save();
    res.json({ analysis });
  } catch (err) { next(err); }
};

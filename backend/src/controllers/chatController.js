const fs = require('fs');
const Document = require('../models/Document');
const ocrService = require('../services/ocrService');
const aiService = require('../services/aiService');

exports.askChat = async (req, res, next) => {
  try {
    const { question, documentId } = req.body;
    if (!question) return res.status(400).json({ message: 'Question is required' });

    let context = '';
    if (documentId) {
      const doc = await Document.findOne({ _id: documentId, user: req.userId });
      if (!doc) return res.status(404).json({ message: 'Document not found' });

      const filePath = `uploads/${doc.filename}`;
      if (!doc.text && fs.existsSync(filePath)) {
        const ext = require('path').extname(doc.originalName || '').toLowerCase();
        if (ext === '.txt' || ext === '.md') {
          try {
            doc.text = await fs.promises.readFile(filePath, 'utf8');
            await doc.save();
          } catch (readErr) {
            console.error('chatController: failed to read text file fallback:', readErr && readErr.stack ? readErr.stack : readErr);
            doc.text = '';
          }
        } else {
          // Skip OCR for non-text uploads to avoid worker crashes
          doc.text = '';
        }
      }
      context = doc.text || '';
    }

    const answer = await aiService.chatQuestion(context, question);
    res.json({ answer });
  } catch (err) {
    next(err);
  }
};

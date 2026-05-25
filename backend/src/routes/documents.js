const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const auth = require('../middleware/authMiddleware');
const { uploadDocument, analyzeDocument, listDocuments, getDocumentDetails } = require('../controllers/documentController');

router.post('/upload', auth, upload.single('file'), uploadDocument);
router.get('/', auth, listDocuments);
router.get('/:id', auth, getDocumentDetails);
router.post('/:id/analyze', auth, analyzeDocument);

module.exports = router;

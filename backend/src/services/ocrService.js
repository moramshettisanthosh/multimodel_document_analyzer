const fs = require('fs').promises;
const path = require('path');
const Tesseract = require('tesseract.js');

exports.extractText = async (filePath) => {
  try {
    // If the file is a plain text or markdown file, just read and return it
    const ext = path.extname(filePath || '').toLowerCase();
    if (ext === '.txt' || ext === '.md') {
      try {
        return await fs.readFile(filePath, 'utf8');
      } catch (fsErr) {
        console.error('ocrService: failed to read text file fallback:', fsErr && fsErr.stack ? fsErr.stack : fsErr);
        return '';
      }
    }

    // Try preferred (worker) API but guard every call so worker implementation mismatches
    if (Tesseract && typeof Tesseract.createWorker === 'function') {
      let worker;
      try {
        worker = Tesseract.createWorker();
        if (worker) {
          if (typeof worker.load === 'function') await worker.load();
          if (typeof worker.loadLanguage === 'function') await worker.loadLanguage('eng');
          if (typeof worker.initialize === 'function') await worker.initialize('eng');
          if (typeof worker.recognize === 'function') {
            const { data: { text } = {} } = await worker.recognize(filePath) || {};
            if (typeof worker.terminate === 'function') await worker.terminate();
            return text || '';
          }
        }
      } catch (workerErr) {
        console.error('ocrService: worker-based OCR failed, falling back:', workerErr && workerErr.stack ? workerErr.stack : workerErr);
        try {
          if (worker && typeof worker.terminate === 'function') await worker.terminate();
        } catch (tErr) {
          console.error('ocrService: failed terminating worker:', tErr && tErr.stack ? tErr.stack : tErr);
        }
      }
    }

    // Fallback: older/high-level API
    if (typeof Tesseract.recognize === 'function') {
      try {
        const res = await Tesseract.recognize(filePath, 'eng');
        if (res && res.data && res.data.text) return res.data.text;
        return '';
      } catch (recErr) {
        console.error('ocrService: recognize() fallback failed:', recErr && recErr.stack ? recErr.stack : recErr);
        return '';
      }
    }

    // If no viable OCR API available, return empty string
    return '';
  } catch (err) {
    // Log and return empty string so callers can proceed
    console.error('ocrService.extractText error:', err && err.stack ? err.stack : err);
    return '';
  }
};

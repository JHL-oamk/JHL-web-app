const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { PDFParse } = require('pdf-parse');
const { saveLawSource, deleteLawSourceByFileUrl } = require('../services/lawSourceService');
const { generateApiContext } = require('../services/claudeService');

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed.'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
}).single('file');

const uploadLawSourceFileController = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const filePath = path.join(uploadsDir, req.file.filename);

    // Kategoria frontendistä — jos annettu käytetään sitä
    const categoryFromFrontend = req.body?.category || null;

    try {
      const fileBuffer = fs.readFileSync(filePath);
      const parser = new PDFParse({ data: fileBuffer });
      const parsed = await parser.getText();
      await parser.destroy();

      let extractedText = '';
      if (typeof parsed === 'string') {
        extractedText = parsed;
      } else if (parsed && typeof parsed.text === 'string') {
        extractedText = parsed.text;
      } else if (parsed && Array.isArray(parsed.pages)) {
        extractedText = parsed.pages.map(p => (p && p.text) || '').join(' ');
      } else {
        extractedText = String(parsed || '');
      }

      extractedText = extractedText.replace(/\s+/g, ' ').trim();
      const content = extractedText.slice(0, 150000);
      const summarySource = extractedText.slice(0, 100000);
      const apiContext = await generateApiContext(summarySource, req.file.originalname, fileUrl);
      const docId = `${Date.now()}-${req.file.filename}`;

      const saved = await saveLawSource({
        docId,
        title: req.file.originalname,
        fileUrl,
        fileName: req.file.originalname,
        content,
        apiContext,
        category: categoryFromFrontend, // ← käytetään frontendin kategoriaa
        uploadedBy: req.user?.uid,
      });

      return res.json({ id: docId, fileName: req.file.originalname, fileUrl, api_context: saved.api_context, active: saved.active, category: saved.category, language: saved.language });
    } catch (error) {
      console.error('PDF upload error:', error);
      return res.status(500).json({ error: 'Failed to parse and store PDF file.' });
    }
  });
};

const deleteLawSourceFileController = async (req, res) => {
  const { fileUrl } = req.body || {};
  if (!fileUrl) {
    return res.status(400).json({ error: 'fileUrl is required' });
  }

  let filePath;
  try {
    const parsedUrl = new URL(fileUrl, `${req.protocol}://${req.get('host')}`);
    const urlPath = parsedUrl.pathname;
    if (!urlPath.startsWith('/uploads/')) {
      return res.status(400).json({ error: 'Invalid upload path' });
    }
    filePath = path.join(__dirname, '../../', urlPath);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid fileUrl' });
  }

  const normalizedUploadsDir = path.normalize(uploadsDir + path.sep);
  const normalizedFilePath = path.normalize(filePath);
  if (!normalizedFilePath.startsWith(normalizedUploadsDir)) {
    return res.status(400).json({ error: 'Invalid upload path' });
  }

  if (!fs.existsSync(normalizedFilePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  try {
    fs.unlinkSync(normalizedFilePath);
    const deletedIds = await deleteLawSourceByFileUrl(fileUrl);
    return res.json({ success: true, deletedIds });
  } catch (error) {
    console.error('Failed to delete law source file:', error);
    return res.status(500).json({ error: 'Failed to delete file' });
  }
};

module.exports = {
  uploadLawSourceFileController,
  deleteLawSourceFileController,
};
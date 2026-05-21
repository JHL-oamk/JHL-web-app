const fs = require('fs');
const path = require('path');
const multer = require('multer');

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

const uploadLawSourceFileController = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ fileName: req.file.originalname, fileUrl });
  });
};

const deleteLawSourceFileController = (req, res) => {
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
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete file' });
  }
};

module.exports = {
  uploadLawSourceFileController,
  deleteLawSourceFileController,
};

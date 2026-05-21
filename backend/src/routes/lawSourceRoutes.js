const express = require('express');
const router = express.Router();
const { uploadLawSourceFileController, deleteLawSourceFileController } = require('../controllers/lawSourceController');

router.post('/upload', uploadLawSourceFileController);
router.delete('/upload', deleteLawSourceFileController);

module.exports = router;

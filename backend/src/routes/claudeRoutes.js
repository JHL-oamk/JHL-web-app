const express = require('express');
const router = express.Router();
const { claudeController } = require('../controllers/claudeController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, claudeController);

module.exports = router;
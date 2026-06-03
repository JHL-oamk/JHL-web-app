const express = require('express');
const router = express.Router();
const { getTopLawsController } = require('../controllers/adminController');

router.get('/top-laws', getTopLawsController);

module.exports = router;

const express = require('express');
const router = express.Router();
const { createResultController, getResultsByQueryController } = require('../controllers/resultController');

router.post('/', createResultController);
router.get('/:queryId', getResultsByQueryController);

module.exports = router;
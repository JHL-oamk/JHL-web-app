const express = require('express');
const router = express.Router();
const { createQueryController, getUserQueriesController } = require('../controllers/queryController');

router.post('/', createQueryController);
router.get('/:uid', getUserQueriesController);

module.exports = router;
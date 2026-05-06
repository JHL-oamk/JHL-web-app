const express = require('express');
const router = express.Router();
const { createUserController, getUserController } = require('../controllers/userController');

router.post('/', createUserController);
router.get('/:uid', getUserController);

module.exports = router;
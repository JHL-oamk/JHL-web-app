const express = require('express');
const router = express.Router();
const { createUserController, getUserController, deleteUserController } = require('../controllers/userController');

router.post('/', createUserController);
router.get('/:uid', getUserController);
router.delete('/:uid', deleteUserController);

module.exports = router;
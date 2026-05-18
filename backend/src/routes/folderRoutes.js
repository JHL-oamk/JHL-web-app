const express = require('express');
const router = express.Router();
const {
  createFolderController,
  getFoldersController,
  updateFolderController,
  deleteFolderController,
} = require('../controllers/folderController');

router.post('/', createFolderController);
router.get('/', getFoldersController);
router.put('/:folderId', updateFolderController);
router.delete('/:folderId', deleteFolderController);

module.exports = router;
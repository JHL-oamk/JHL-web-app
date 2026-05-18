const { createFolder, getFolders, updateFolder, deleteFolder } = require('../services/folderService');

const createFolderController = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { folderId, name, color } = req.body;
    await createFolder(uid, folderId, name, color);
    res.status(201).json({ message: 'Folder created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFoldersController = async (req, res) => {
  try {
    const uid = req.user.uid;
    const folders = await getFolders(uid);
    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateFolderController = async (req, res) => {
  try {
    const uid = req.user.uid;
    await updateFolder(uid, req.params.folderId, req.body);
    res.status(200).json({ message: 'Folder updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFolderController = async (req, res) => {
  try {
    const uid = req.user.uid;
    await deleteFolder(uid, req.params.folderId);
    res.status(200).json({ message: 'Folder deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createFolderController, getFoldersController, updateFolderController, deleteFolderController };
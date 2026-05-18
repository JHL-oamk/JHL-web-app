const { db } = require('../config/firebaseAdmin.js');

const getFoldersCollection = (uid) =>
  db.collection('users').doc(uid).collection('folders');

const createFolder = async (uid, folderId, name, color) => {
  await getFoldersCollection(uid).doc(folderId).set({
    name,
    color,
    chatIds: [],
    createdAt: new Date().toISOString(),
  });
};

const getFolders = async (uid) => {
  const snap = await getFoldersCollection(uid).orderBy('createdAt', 'asc').get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const updateFolder = async (uid, folderId, data) => {
  await getFoldersCollection(uid).doc(folderId).update(data);
};

const deleteFolder = async (uid, folderId) => {
  await getFoldersCollection(uid).doc(folderId).delete();
};

module.exports = { createFolder, getFolders, updateFolder, deleteFolder };
const { db } = require('../config/firebaseAdmin.js');

const getChatsCollection = (uid) =>
  db.collection('users').doc(uid).collection('chats');

const createChat = async (uid, chatId, title) => {
  await getChatsCollection(uid).doc(chatId).set({
    title,
    folderId: null,
    messages: [{ role: 'assistant', content: 'WELCOME_VIEW' }],
    context: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

const getChats = async (uid) => {
  const snap = await getChatsCollection(uid).orderBy('updatedAt', 'desc').get();
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getChat = async (uid, chatId) => {
  const snap = await getChatsCollection(uid).doc(chatId).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
};

const updateChatMessages = async (uid, chatId, messages) => {
  await getChatsCollection(uid).doc(chatId).update({
    messages,
    updatedAt: new Date().toISOString(),
  });
};

const updateChatTitle = async (uid, chatId, title) => {
  await getChatsCollection(uid).doc(chatId).update({ title });
};

const updateChatFolder = async (uid, chatId, folderId) => {
  await getChatsCollection(uid).doc(chatId).update({ folderId });
};

// Saves selected sources [{ name, link }]
const updateChatContext = async (uid, chatId, context) => {
  await getChatsCollection(uid).doc(chatId).update({ context });
};

const deleteChat = async (uid, chatId) => {
  await getChatsCollection(uid).doc(chatId).delete();
};

module.exports = {
  createChat, getChats, getChat,
  updateChatMessages, updateChatTitle,
  updateChatFolder, updateChatContext, deleteChat,
};
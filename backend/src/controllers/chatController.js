const {
  createChat,
  getChats,
  getChat,
  updateChatMessages,
  updateChatTitle,
  updateChatFolder,
  deleteChat,
} = require('../services/chatService');

const createChatController = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { chatId, title } = req.body;
    await createChat(uid, chatId, title);
    res.status(201).json({ message: 'Chat created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChatsController = async (req, res) => {
  try {
    const uid = req.user.uid;
    const chats = await getChats(uid);
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChatController = async (req, res) => {
  try {
    const uid = req.user.uid;
    const chat = await getChat(uid, req.params.chatId);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateChatMessagesController = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { messages } = req.body;
    await updateChatMessages(uid, req.params.chatId, messages);
    res.status(200).json({ message: 'Messages updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateChatTitleController = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { title } = req.body;
    await updateChatTitle(uid, req.params.chatId, title);
    res.status(200).json({ message: 'Title updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateChatFolderController = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { folderId } = req.body;
    await updateChatFolder(uid, req.params.chatId, folderId);
    res.status(200).json({ message: 'Folder updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteChatController = async (req, res) => {
  try {
    const uid = req.user.uid;
    await deleteChat(uid, req.params.chatId);
    res.status(200).json({ message: 'Chat deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createChatController,
  getChatsController,
  getChatController,
  updateChatMessagesController,
  updateChatTitleController,
  updateChatFolderController,
  deleteChatController,
};
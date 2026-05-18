const {
  createChat, getChats, getChat,
  updateChatMessages, updateChatTitle,
  updateChatFolder, updateChatContext, deleteChat,
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
    const chats = await getChats(req.user.uid);
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChatController = async (req, res) => {
  try {
    const chat = await getChat(req.user.uid, req.params.chatId);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateChatMessagesController = async (req, res) => {
  try {
    await updateChatMessages(req.user.uid, req.params.chatId, req.body.messages);
    res.status(200).json({ message: 'Messages updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateChatTitleController = async (req, res) => {
  try {
    await updateChatTitle(req.user.uid, req.params.chatId, req.body.title);
    res.status(200).json({ message: 'Title updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateChatFolderController = async (req, res) => {
  try {
    await updateChatFolder(req.user.uid, req.params.chatId, req.body.folderId);
    res.status(200).json({ message: 'Folder updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateChatContextController = async (req, res) => {
  try {
    await updateChatContext(req.user.uid, req.params.chatId, req.body.context);
    res.status(200).json({ message: 'Context updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteChatController = async (req, res) => {
  try {
    await deleteChat(req.user.uid, req.params.chatId);
    res.status(200).json({ message: 'Chat deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createChatController, getChatsController, getChatController,
  updateChatMessagesController, updateChatTitleController,
  updateChatFolderController, updateChatContextController, deleteChatController,
};
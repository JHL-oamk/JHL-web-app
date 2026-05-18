const express = require('express');
const router = express.Router();
const {
  createChatController, getChatsController, getChatController,
  updateChatMessagesController, updateChatTitleController,
  updateChatFolderController, updateChatContextController, deleteChatController,
} = require('../controllers/chatController');

router.post('/', createChatController);
router.get('/', getChatsController);
router.get('/:chatId', getChatController);
router.put('/:chatId/messages', updateChatMessagesController);
router.put('/:chatId/title', updateChatTitleController);
router.put('/:chatId/folder', updateChatFolderController);
router.put('/:chatId/context', updateChatContextController);
router.delete('/:chatId', deleteChatController);

module.exports = router;
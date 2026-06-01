import { auth } from "../config/firebase";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = async () => {
  const token = await auth.currentUser?.getIdToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const createChatApi = async (chatId, title) => {
  const res = await fetch(`${API_URL}/api/chats`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ chatId, title }),
  });
  return res.json();
};

export const getChatsApi = async () => {
  const res = await fetch(`${API_URL}/api/chats`, {
    headers: await getAuthHeaders(),
  });
  return res.json();
};

export const getChatApi = async (chatId) => {
  const res = await fetch(`${API_URL}/api/chats/${chatId}`, {
    headers: await getAuthHeaders(),
  });
  return res.json();
};

export const updateChatMessagesApi = async (chatId, messages) => {
  const res = await fetch(`${API_URL}/api/chats/${chatId}/messages`, {
    method: "PUT",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ messages }),
  });
  return res.json();
};

export const updateChatTitleApi = async (chatId, title) => {
  const res = await fetch(`${API_URL}/api/chats/${chatId}/title`, {
    method: "PUT",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ title }),
  });
  return res.json();
};

export const updateChatFolderApi = async (chatId, folderId) => {
  const res = await fetch(`${API_URL}/api/chats/${chatId}/folder`, {
    method: "PUT",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ folderId }),
  });
  return res.json();
};

export const updateChatContextApi = async (chatId, context) => {
  const res = await fetch(`${API_URL}/api/chats/${chatId}/context`, {
    method: "PUT",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ context }),
  });
  return res.json();
};

export const deleteChatApi = async (chatId) => {
  const res = await fetch(`${API_URL}/api/chats/${chatId}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });
  return res.json();
};
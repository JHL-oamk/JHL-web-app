import { auth } from "../config/firebase";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = async () => {
  const token = await auth.currentUser?.getIdToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const createFolderApi = async (folderId, name, color) => {
  const res = await fetch(`${API_URL}/api/folders`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({ folderId, name, color }),
  });
  return res.json();
};

export const getFoldersApi = async () => {
  const res = await fetch(`${API_URL}/api/folders`, {
    headers: await getAuthHeaders(),
  });
  return res.json();
};

export const updateFolderApi = async (folderId, data) => {
  const res = await fetch(`${API_URL}/api/folders/${folderId}`, {
    method: "PUT",
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteFolderApi = async (folderId) => {
  const res = await fetch(`${API_URL}/api/folders/${folderId}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });
  return res.json();
};
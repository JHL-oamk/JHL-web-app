import { auth } from '../config/firebase';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = async () => {
  const token = await auth.currentUser?.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const uploadLawSourceFileApi = async (file, category = null) => {
  const formData = new FormData();
  formData.append('file', file);
  if (category) {
    formData.append('category', category); // ← lähetä kategoria backendille
  }

  const response = await fetch(`${API_URL}/api/law-sources/upload`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'File upload failed');
  }

  const responseBody = await response.json();
  return {
    ...responseBody,
    fileUrl: `${API_URL}${responseBody.fileUrl}`,   // täysi URL React-statea varten
    rawFileUrl: responseBody.fileUrl,                // relatiivinen polku poistoa varten
  };
};

export const deleteLawSourceFileApi = async (fileUrl) => {
  const response = await fetch(`${API_URL}/api/law-sources/upload`, {
    method: 'DELETE',
    headers: {
      ...await getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileUrl }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to delete uploaded file');
  }

  return response.json();
};
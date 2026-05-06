const API_URL = import.meta.env.VITE_API_URL;

export const createQuery = async (uid, question) => {
  const response = await fetch(`${API_URL}/api/queries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, question })
  });
  return await response.json();
};

export const getUserQueries = async (uid) => {
  const response = await fetch(`${API_URL}/api/queries/${uid}`);
  return await response.json();
};
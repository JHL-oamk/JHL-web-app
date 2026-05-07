const API_URL = import.meta.env.VITE_API_URL;

export const createResult = async (queryId, answer, sources = []) => {
  const response = await fetch(`${API_URL}/api/results`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ queryId, answer, sources })
  });
  return await response.json();
};

export const getResultsByQueryId = async (queryId) => {
  const response = await fetch(`${API_URL}/api/results/${queryId}`);
  return await response.json();
};
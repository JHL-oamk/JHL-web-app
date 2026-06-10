import { auth } from "../config/firebase";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = async () => {
  const token = await auth.currentUser?.getIdToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getTopLawsApi = async () => {
  const res = await fetch(`${API_URL}/api/admin/top-laws`, {
    headers: await getAuthHeaders(),
  });
  return res.json();
};

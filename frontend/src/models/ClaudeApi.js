import { auth } from "../config/firebase";

const API_URL = import.meta.env.VITE_API_URL;

export async function askClaude(question, selectedLaws = []) {
  try {
    const token = await auth.currentUser?.getIdToken();
    if (!token) return { reply: "You must be logged in.", sources: [] };

    const response = await fetch(`${API_URL}/api/claude`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        question,
        lawIds: selectedLaws.length > 0 ? selectedLaws : undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { reply: errorData.error || "AI request failed.", sources: [] };
    }

    const data = await response.json();
    return {
      reply: data.data,
      sources: data.selectedSources || [],
    };

  } catch (error) {
    console.error("Error calling Claude API:", error);
    return { reply: "Failed to connect to AI service.", sources: [] };
  }
}
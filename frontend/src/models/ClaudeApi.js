import { auth } from "../config/firebase";

export async function askClaude(question, selectedLaws = []) {
  try {
    const token = await auth.currentUser?.getIdToken();

    if (!token) {
      return "You must be logged in to use the chatbot.";
    }

    const response = await fetch("/api/claude", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        question,
        lawIds: selectedLaws, // changed to use firestores selectedLaws → lawIds
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.error || "AI request failed.";
    }

    const data = await response.json();
    return data.data;

  } catch (error) {
    console.error("Error calling Claude API:", error);
    return "Failed to connect to AI service. Make sure the server is running.";
  }
}
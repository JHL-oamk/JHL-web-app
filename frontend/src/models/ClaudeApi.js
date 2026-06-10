import { auth } from "../config/firebase";

const API_URL = import.meta.env.VITE_API_URL;

export async function askClaude(question, selectedLaws = [], conversationHistory = [], onChunk = null) {
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
        conversationHistory: conversationHistory.length > 0 ? conversationHistory : undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { reply: errorData.error || "AI request failed.", sources: [] };
    }

    // SSE streaming: luetaan vastaus chunk kerrallaan
    if (onChunk) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let sources = [];
      let truncated = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder.decode(value, { stream: true }).split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          try {
            const event = JSON.parse(line.slice(6));

            if (event.type === "meta") {
              sources = event.selectedSources || [];
              truncated = event.truncated || false;
            } else if (event.type === "chunk") {
              fullText += event.text;
              onChunk(event.text);
            } else if (event.type === "error") {
              return { reply: event.error || "AI service failed.", sources: [] };
            }
            // type === "done" — loop loppuu luonnollisesti
          } catch {
            // ohitetaan malformed JSON
          }
        }
      }

      return { reply: fullText, sources, truncated };
    }

    // Fallback: normaali JSON-vastaus jos onChunk ei annettu
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
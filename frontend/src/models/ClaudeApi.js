export async function askClaude(question, selectedLaws = []) {
  try {
    const token = localStorage.getItem("authToken"); // ← lisätty

    const response = await fetch("/api/claude", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`  // ← lisätty
      },
      body: JSON.stringify({
        question,
        selectedLaws: selectedLaws || [],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return errorData.error || "AI request failed.";
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error calling Claude API:", error);
    return "Failed to connect to AI service. Make sure the server is running.";
  }
}
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// ⚠️ DO NOT CHANGE (as requested)
const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash",
  "gemini-1.5-pro"
];

async function callModel(modelName, prompt) {
  const model = genAI.getGenerativeModel({ model: modelName });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * question: string
 * selectedLaws: string[] (law links)
 */
export async function askGemini(question, selectedLaws = []) {
  const lawContext =
    selectedLaws.length > 0
      ? `\nYou must ONLY use the following laws:\n${selectedLaws.join("\n")}\n`
      : "";

  const prompt = `
You are a professional Finnish legal assistant.

You must base your answer ONLY on the provided law texts.

If the law text does not contain the answer, say "Not found in provided law."

-------------------
${lawContext}
-------------------

User question:
${question}
`;

  let lastError;

  for (const model of MODELS) {
    try {
      console.log("Trying:", model);
      return await callModel(model, prompt);
    } catch (err) {
      console.warn("Failed:", model, err);
      lastError = err;
    }
  }

  const msg = lastError?.message?.toLowerCase?.() || "";

  if (msg.includes("404")) {
    return "This model is not enabled in your API project.";
  }

  if (msg.includes("api_key")) {
    return "Invalid API key.";
  }

  return "AI request failed.";
}
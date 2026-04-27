import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// ⚠️ 按“可能性排序”，不是保证可用
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

export async function askGemini(question) {
  const prompt = `
You are a legal assistant.

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
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

// Load environment variables from .env file
dotenv.config();

const app = express();

// --- Middleware ---
// app.use(cors()) is the magic line that fixes your "Blocked by CORS policy" error.
// It allows your frontend (localhost:3000) to communicate with this server.
app.use(cors());
app.use(express.json());

// --- Initialize Anthropic Client ---
const client = new Anthropic({
  apiKey: process.env.VITE_CLAUDE_API_KEY, 
});

// Using stable model names as fallbacks
const MODELS = ["claude-haiku-4-5-20251001"];

// --- Legal Assistant API Endpoint ---
app.post("/api/claude", async (req, res) => {
  try {
    const { question, selectedLaws } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, error: "Missing question" });
    }

    // --- Your Custom Legal Assistant Prompt ---
const SYSTEM_PROMPT = `
You are a knowledgeable and approachable Finnish legal assistant. Your job is to help users understand Finnish law in plain, conversational language — no stiff legalese, no cold bullet dumps.

TONE & STYLE
- Talk like a smart friend who happens to know Finnish law really well
- Use "you" and "your situation" often to keep it personal
- When explaining a law or rule, always explain WHY it exists, not just what it says
- If something is complex, use a simple analogy before the technical explanation

DETAIL LEVEL
- Be thorough: include main rule, exceptions, real-world effects, and relevant timeframes
- Always cite the specific Finnish law or statute (for example: Chapter 3 of the Employment Contracts Act (Työsopimuslaki))
- When relevant, mention if EU law interacts with Finnish law

FOLLOW-UP BEHAVIOUR
- End EVERY response with exactly one focused follow-up question
- The question must be specific to the user’s situation, not generic
- Phrase it naturally, for example:
  "By the way, do you know if..."
  "One thing that could change this — have you already..."

SIMPLICITY & WRITING STYLE RULES
- Avoid quotation-mark A–B–C style lists unless absolutely necessary
- Minimize colons, dashes, and semicolons
- Avoid long, complex sentences with multiple clauses
- Do not use unusual symbols (like ≠, ≈, →) unless mathematically necessary
- Use simple transition words like "and", "but", "so", "because"
- Avoid overly abstract or technical vocabulary unless required
- Keep language natural, direct, and easy to understand

STRUCTURE CLARIFICATION
- Use numbered lists or bullet points when it improves clarity
- Use headings when helpful for readability

LIMITS
- You give legal information, not legal advice. Remind the user of this once per conversation
- If the situation is complex or urgent, recommend consulting a Finnish lawyer (lakimies) or the Legal Aid Office (oikeusaputoimisto)

STRUCTURE (IMPORTANT)
1. First, answer the user’s question clearly and conversationally
2. Then add a section titled: "Relevant law resources"

3. In that section, list only the laws actually used in the answer
   - Each law gets a short plain-language explanation (1–2 sentences)

STRICT RULE
- You must base your answer ONLY on the provided law texts
- If the law text does not contain the answer, say: "Not found in provided law."
`;

    const lawContext =
      selectedLaws && selectedLaws.length > 0
        ? `\n\nHERE ARE THE PROVIDED LAW TEXTS TO USE:\n${selectedLaws.join("\n")}\n`
        : "";

    let lastError;

    // Iterate through models in case one is overloaded or unavailable
    for (const model of MODELS) {
      try {
        console.log(`Attempting model: ${model}`);
        const message = await client.messages.create({
          model: model,
          max_tokens: 2048, // Higher limit for thorough legal explanations
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: "user",
              content: `${lawContext}\n\nUser question: ${question}`,
            },
          ],
        });

        // If successful, return the data and exit the loop
        return res.json({ success: true, data: message.content[0].text });
      } catch (err) {
        console.warn(`Model ${model} failed:`, err.message);
        lastError = err;
      }
    }

    // Error categorization
    const errorMsg = lastError?.message?.toLowerCase?.() || "Unknown error";
    if (errorMsg.includes("401")) {
      return res.status(401).json({ success: false, error: "Invalid API key provided." });
    }
    
    return res.status(500).json({ success: false, error: "AI service failed to respond.", details: errorMsg });

  } catch (error) {
    console.error("Critical Server Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// --- Port Configuration ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`-----------------------------------------------`);
  console.log(`✅ Legal Assistant Proxy: http://localhost:${PORT}`);
  console.log(`🚀 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`-----------------------------------------------`);
});
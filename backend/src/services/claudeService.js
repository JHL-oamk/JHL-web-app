const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

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
- The question must be specific to the user's situation, not generic

SIMPLICITY & WRITING STYLE RULES
- Avoid long, complex sentences with multiple clauses
- Use simple transition words like "and", "but", "so", "because"
- Keep language natural, direct, and easy to understand

LIMITS
- You give legal information, not legal advice. Remind the user of this once per conversation
- If the situation is complex or urgent, recommend consulting a Finnish lawyer (lakimies) or the Legal Aid Office (oikeusaputoimisto)

STRUCTURE
1. Answer the user's question clearly and conversationally.
2. At the end of your response, add a section titled "Law sources:" followed by a horizontal rule.
3. For each law entry, use this EXACT markdown format:
   [Full Name of Law]](#)   Published Date: DD-MM-YYYY
   [https://www.finlex.fi/...]


Rules:
- Only list laws you actually used in your answer
- Use the official Finnish law name (in Finnish or English as appropriate)
- Link directly to the law on finlex.fi
- Published date format: DD-MM-YYYY
- Do not add extra commentary under law entries

STRICT RULES
- Never infer or assume Finnish law outside the provided law text
- Do not use general legal knowledge
- If exact answer is unavailable in provided law, explicitly say:
  "Not found in provided law."
`;

const askClaude = async (question, selectedLaws = []) => {
  const lawContext = selectedLaws.length > 0
    ? `\n\nHERE ARE THE PROVIDED LAW TEXTS TO USE:\n${selectedLaws.join("\n")}\n`
    : "";

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `${lawContext}\n\nUser question: ${question}`,
      },
    ],
  });

  return message.content[0].text;
};

const generateApiContext = async (documentText, title = '', url = '', category = 'Other Documents') => {
  const summaryPrompt = title ? `Document title: ${title}\n\n` : '';

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1000,
    system: `
You are a legal document analysis assistant.

Your task:
1. Detect the document language using ISO language codes (examples: "fi", "en").
2. Create a concise api_context summary for chatbot usage.

Rules:
- Keep the summary factual and concise.
- Focus on the document's purpose, obligations, and key themes.
- Do not invent facts.
- Return ONLY valid JSON.

Response format:
{
  "language": "fi",
  "api_context": "Short summary here"
}
`,
    messages: [
      {
        role: 'user',
        content: `${summaryPrompt}Analyze the following document:\n\n${documentText}`,
      },
    ],
  });

  const rawText = message?.content?.[0]?.text || '{}';

  let parsed;

  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    parsed = {
      language: 'unknown',
      api_context: '',
    };
  }
    // Ensure api_context contains a non-empty summary; fallback to a short excerpt
    let apiContextText = '';
    if (parsed && typeof parsed.api_context === 'string' && parsed.api_context.trim()) {
      apiContextText = parsed.api_context.trim();
    } else if (parsed && parsed.api_context && typeof parsed.api_context.text === 'string' && parsed.api_context.text.trim()) {
      apiContextText = parsed.api_context.text.trim();
    } else if (documentText && documentText.length > 0) {
      // fallback: take first 1000 characters and trim to sentence
      apiContextText = documentText.slice(0, 1000).replace(/\s+/g, ' ').trim();
      const lastPeriod = apiContextText.lastIndexOf('.');
      if (lastPeriod > 200) apiContextText = apiContextText.slice(0, lastPeriod + 1);
    }

    // Use language from Claude when provided; treat 'unknown' as missing and default to 'fi'
    let language = (parsed && parsed.language);
    if (!language || language === 'unknown') language = 'fi';

    return {
      active: true,
      api_context: apiContextText,
      category: category || 'Other Documents',
      content: documentText?.slice(0, 150000) || '',
      language: language || 'unknown',
      title: title || 'User Provided Title',
      type: 'law',
      url: url || '',
    };
};

module.exports = { askClaude, generateApiContext };
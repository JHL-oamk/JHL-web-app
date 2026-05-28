const { askClaude } = require('../services/claudeService');
const { db } = require('../config/firebaseAdmin');

const MAX_LAWS = 3;
const MAX_CHARS_PER_LAW = 6000; // raised 4000 → 6000

const claudeController = async (req, res) => {
  try {
    const { question, lawIds } = req.body;

    console.log("Received lawIds:", JSON.stringify(lawIds));

    if (!question) {
      return res.status(400).json({ success: false, error: "Missing question" });
    }

    const safeLawIds = (lawIds || []).slice(0, MAX_LAWS);

    console.log("safeLawIds:", JSON.stringify(safeLawIds));

    let lawTexts = [];

    if (safeLawIds.length > 0) {
      const docs = await Promise.all(safeLawIds.map((id) => db.collection('lawSources').doc(id).get()));

      docs.forEach((doc, i) => {
        console.log(`Doc ${i} (id: ${safeLawIds[i]}): exists=${doc.exists}, hasApiContext=${!!doc.data()?.api_context}`);
      });

      lawTexts = docs
        .filter((doc) => doc.exists && (doc.data().content || doc.data().api_context))
        .map((doc) => {
          const data = doc.data();
          // Prefer full document content for context; fall back to api_context string
          let sourceText = data.content || '';

          if (!sourceText && data.api_context) {
            if (typeof data.api_context === 'string') {
              sourceText = data.api_context;
            } else if (typeof data.api_context.api_context === 'string') {
              sourceText = data.api_context.api_context;
            }
          }

          const trimmedText = (sourceText || '').slice(0, MAX_CHARS_PER_LAW);

          return `### ${data.title}\nURL: ${data.url || ''}\n\n${trimmedText}`;
        });

      console.log("lawTexts count after filter:", lawTexts.length);
    }

    const reply = await askClaude(question, lawTexts);

    console.log("Reply length:", reply.length);

    return res.json({ success: true, data: reply });

  } catch (error) {
    console.error("Claude API error:", error.message);
    return res.status(500).json({ success: false, error: "AI service failed" });
  }
};

module.exports = { claudeController };
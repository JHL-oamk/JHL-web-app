const { askClaude } = require('../services/claudeService');
const { db } = require('../config/firebaseAdmin');

const MAX_LAWS = 3;
const MAX_CHARS_PER_LAW = 4000;

const claudeController = async (req, res) => {
  try {
    const { question, lawIds } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, error: "Missing question" });
    }

    // HARD LIMIT (backend safety, ei voi ohittaa frontendistä)
    const safeLawIds = (lawIds || []).slice(0, MAX_LAWS);

    let lawTexts = [];

    if (safeLawIds.length > 0) {
      const docs = await Promise.all(
        safeLawIds.map(id =>
          db.collection('lawSources').doc(id).get()
        )
      );

      lawTexts = docs
        .filter(doc => doc.exists && doc.data().content)
        .map(doc => {
          const data = doc.data();

          // TOKEN SAFE TRIM
          const trimmedContent = (data.content || "").slice(0, MAX_CHARS_PER_LAW);

          return `### ${data.title}\n${trimmedContent}`;
        });
    }

    const reply = await askClaude(question, lawTexts);

    return res.json({ success: true, data: reply });

  } catch (error) {
    console.error("Claude API error:", error.message);
    return res.status(500).json({ success: false, error: "AI service failed" });
  }
};

module.exports = { claudeController };
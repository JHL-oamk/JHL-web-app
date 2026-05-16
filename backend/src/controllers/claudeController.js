const { askClaude } = require('../services/claudeService');
const { db } = require('../config/firebaseAdmin');

const claudeController = async (req, res) => {
  try {
    const { question, lawIds } = req.body; // selectedLaws → lawIds

    if (!question) {
      return res.status(400).json({ success: false, error: "Missing question" });
    }

    // fetch from firestore based on id
    let lawTexts = [];
    if (lawIds && lawIds.length > 0) {
      const docs = await Promise.all(
        lawIds.map(id => db.collection('lawSources').doc(id).get())
      );
      lawTexts = docs
        .filter(doc => doc.exists && doc.data().content)
        .map(doc => `### ${doc.data().title}\n${doc.data().content}`);
    }

    const reply = await askClaude(question, lawTexts);
    return res.json({ success: true, data: reply });

  } catch (error) {
    console.error("Claude API error:", error.message);
    return res.status(500).json({ success: false, error: "AI service failed" });
  }
};

module.exports = { claudeController };
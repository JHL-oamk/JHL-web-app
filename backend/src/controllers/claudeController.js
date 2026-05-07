const { askClaude } = require('../services/claudeService');

const claudeController = async (req, res) => {
  try {
    const { question, selectedLaws } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, error: "Missing question" });
    }

    const reply = await askClaude(question, selectedLaws);
    return res.json({ success: true, data: reply });

  } catch (error) {
    console.error("Claude API error:", error.message);
    if (error.message?.includes("401")) {
      return res.status(401).json({ success: false, error: "Invalid API key" });
    }
    return res.status(500).json({ success: false, error: "AI service failed" });
  }
};

module.exports = { claudeController };
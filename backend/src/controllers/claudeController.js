const { askClaude, selectRelevantSources } = require('../services/claudeService');
const { db } = require('../config/firebaseAdmin');

const MAX_CHARS_PER_DOC = 140000; // Rajataan yksittäisen dokumentin pituus, jotta mahtuu Haikun kontekstiin
const MAX_TOTAL_CHARS = 200000;

// Firestore in-memory cache
const docCache = new Map();

const fetchSingleSource = async (selected) => {
  if (selected.type === 'tes_chunk') {
    const cacheKey = `chunk:${selected.id}`;
    if (docCache.has(cacheKey)) {
      console.log("Cache hit:", cacheKey);
      return docCache.get(cacheKey);
    }
    const doc = await db.collection('lawSources').doc(selected.id).get();
    const texts = [];
    if (doc.exists && doc.data().content) {
      const data = doc.data();
      const content = (data.content || "").slice(0, MAX_CHARS_PER_DOC);
      texts.push(`### ${data.title}\n${content}`);
    }
    docCache.set(cacheKey, texts);
    return texts;
  }

  const cacheKey = `law:${selected.id}`;
  if (docCache.has(cacheKey)) {
    console.log("Cache hit:", cacheKey);
    return docCache.get(cacheKey);
  }
  const doc = await db.collection('lawSources').doc(selected.id).get();
  const texts = [];
  if (doc.exists && doc.data().content) {
    const data = doc.data();
    const content = (data.content || "").slice(0, MAX_CHARS_PER_DOC);
    texts.push(`### ${data.title}\nURL: ${data.url || ''}\n\n${content}`);
  }
  docCache.set(cacheKey, texts);
  return texts;
};

const fetchLawTexts = async (selectedSources) => {
  const results = await Promise.all(selectedSources.map(s => fetchSingleSource(s)));
  const allTexts = results.flat();

  let total = 0;
  const filtered = allTexts.filter(text => {
    total += text.length;
    return total <= MAX_TOTAL_CHARS;
  });

  if (filtered.length < allTexts.length) {
    console.log(`Truncated: kept ${filtered.length}/${allTexts.length} chunks (total chars: ${total})`);
  }

  return { texts: filtered, truncated: filtered.length < allTexts.length };
};

const claudeController = async (req, res) => {
  try {
    const { question, lawIds, conversationHistory = [] } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, error: "Missing question" });
    }

    const snapshot = await db.collection('lawSources')
      .where('active', '==', true)
      .get();

    const allDocs = snapshot.docs;

    // SSE headerit
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Rakenna lähdelista Haikulle — suodata manuaalisen valinnan mukaan jos annettu
    const allSources = allDocs
      .filter(doc => doc.data().api_context)
      .map(doc => ({
        id: doc.id,
        title: doc.data().title,
        type: doc.data().type,
        parent: doc.data().parent || null,
        category: doc.data().category,
        api_context: doc.data().api_context,
      }));

    let sourcesToSearch;

    if (lawIds && lawIds.length > 0) {
      // Manuaalinen valinta: Haiku etsii vain valittujen TES/lakien sisältä
      console.log("Manual filter:", lawIds);

      const allowedIds = new Set(lawIds);
      const allowedParents = new Set(
        lawIds.filter(id => id.startsWith('tes:')).map(id => id.replace('tes:', ''))
      );

      sourcesToSearch = allSources.filter(s => {
        if (s.type === 'tes_chunk') return allowedParents.has(s.parent);
        return allowedIds.has(s.id);
      });

      console.log(`Filtered to ${sourcesToSearch.length} sources from manual selection`);
    } else {
      // Automaattinen valinta: kaikki lähteet
      sourcesToSearch = allSources;
    }

    // Haiku valitsee 2-4 relevanteinta chunkkia
    const selectedSources = await selectRelevantSources(question, sourcesToSearch);
    console.log("Selected sources:", selectedSources.map(s => s.title || s.parent));

    const { texts: lawTexts, truncated } = await fetchLawTexts(selectedSources);
    console.log("Total law text chunks:", lawTexts.length);

    const selectedSourcesMeta = selectedSources.map(s => ({
      id: s.type === 'tes_chunk' ? `tes:${s.parent}` : s.id,
      title: s.title || s.parent,
    }));

    res.write(`data: ${JSON.stringify({ type: 'meta', truncated, selectedSources: selectedSourcesMeta })}\n\n`);

    await askClaude(question, lawTexts, conversationHistory, (chunk) => {
      res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`);
    });

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();

  } catch (error) {
    console.error("Claude API error:", error.message);
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ type: 'error', error: 'AI service failed' })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ success: false, error: "AI service failed" });
    }
  }
};

module.exports = { claudeController };

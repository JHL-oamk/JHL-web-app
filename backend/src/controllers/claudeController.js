const { askClaude, selectRelevantSources } = require('../services/claudeService');
const { db } = require('../config/firebaseAdmin');

const MAX_CHUNKS_PER_TES = 15;
const MAX_CHARS_PER_DOC = 6000;

const fetchLawTexts = async (selectedSources) => {
  const lawTexts = [];

  for (const selected of selectedSources) {
    if (selected.type === 'tes_chunk') {
      const snap = await db.collection('lawSources')
        .where('type', '==', 'tes_chunk')
        .where('parent', '==', selected.parent)
        .where('active', '==', true)
        .limit(MAX_CHUNKS_PER_TES)
        .get();

      snap.docs.forEach(doc => {
        const data = doc.data();
        const content = (data.content || "").slice(0, MAX_CHARS_PER_DOC);
        lawTexts.push(`### ${data.title}\n${content}`);
      });

    } else {
      const doc = await db.collection('lawSources').doc(selected.id).get();
      if (doc.exists && doc.data().content) {
        const data = doc.data();
        const content = (data.content || "").slice(0, MAX_CHARS_PER_DOC);
        lawTexts.push(`### ${data.title}\nURL: ${data.url || ''}\n\n${content}`);
      }
    }
  }

  return lawTexts;
};

const claudeController = async (req, res) => {
  try {
    const { question, lawIds } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, error: "Missing question" });
    }

    // Hae kaikki aktiiviset lähteet Firestoresta
    const snapshot = await db.collection('lawSources')
      .where('active', '==', true)
      .get();

    const allDocs = snapshot.docs;

    let selectedSources = [];

    // Jos käyttäjä on valinnut lähteet manuaalisesti → käytä niitä
    if (lawIds && lawIds.length > 0) {
      console.log("Using manual lawIds:", lawIds);

      for (const id of lawIds) {
        if (id.startsWith('tes:')) {
          const parent = id.replace('tes:', '');
          const representative = allDocs.find(
            d => d.data().type === 'tes_chunk' && d.data().parent === parent
          );
          if (representative) {
            selectedSources.push({
              id: representative.id,
              type: 'tes_chunk',
              parent,
              title: parent,
              category: representative.data().category,
              api_context: representative.data().api_context,
            });
          }
        } else {
          const doc = allDocs.find(d => d.id === id);
          if (doc) {
            selectedSources.push({
              id: doc.id,
              type: doc.data().type,
              parent: doc.data().parent || null,
              title: doc.data().title,
              category: doc.data().category,
              api_context: doc.data().api_context,
            });
          }
        }
      }

    } else {
      // Ensimmäinen kysymys → automaattinen valinta api_context perusteella
      console.log("Auto-selecting sources for first question");

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

      // Yhdistä TES chunkkien api_contextit
      const uniqueSources = [];
      const seenParents = new Map();

      for (const src of allSources) {
        if (src.type === 'tes_chunk') {
          if (!seenParents.has(src.parent)) {
            seenParents.set(src.parent, {
              ...src,
              _allContexts: [src.api_context],
              representativeOfParent: true,
            });
          } else {
            const existing = seenParents.get(src.parent);
            existing._allContexts.push(src.api_context);
            existing.api_context = existing._allContexts.join(' | ');
          }
        } else {
          uniqueSources.push(src);
        }
      }

      for (const tes of seenParents.values()) {
        uniqueSources.push(tes);
      }

      selectedSources = await selectRelevantSources(question, uniqueSources);
    }

    console.log("Selected sources:", selectedSources.map(s => s.title || s.parent));

    const lawTexts = await fetchLawTexts(selectedSources);
    console.log("Total law text chunks:", lawTexts.length);

    const reply = await askClaude(question, lawTexts);

    return res.json({
      success: true,
      data: reply,
      selectedSources: selectedSources.map(s => ({
        id: s.type === 'tes_chunk' ? `tes:${s.parent}` : s.id,
        title: s.title || s.parent,
      }))
    });

  } catch (error) {
    console.error("Claude API error:", error.message);
    return res.status(500).json({ success: false, error: "AI service failed" });
  }
};

module.exports = { claudeController };
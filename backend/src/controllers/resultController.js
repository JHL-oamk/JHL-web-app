const { createResult, getResultsByQueryId } = require('../services/resultService');

const createResultController = async (req, res) => {
  try {
    const { queryId, answer, sources } = req.body;
    const ref = await createResult(queryId, answer, sources);
    res.status(201).json({ id: ref.id, message: 'Result created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getResultsByQueryController = async (req, res) => {
  try {
    const results = await getResultsByQueryId(req.params.queryId);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createResultController, getResultsByQueryController };
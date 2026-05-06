const { createQuery, getUserQueries } = require('../services/queryService');

const createQueryController = async (req, res) => {
  try {
    const { uid, question } = req.body;
    const ref = await createQuery(uid, question);
    res.status(201).json({ id: ref.id, message: 'Query created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserQueriesController = async (req, res) => {
  try {
    const queries = await getUserQueries(req.params.uid);
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createQueryController, getUserQueriesController };
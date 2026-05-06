const { db } = require('../config/firebaseAdmin.js');

const createResult = async (queryId, answer, sources = []) => {
  const ref = await db.collection('results').add({
    queryId,
    answer,
    sources,
    createdAt: new Date()
  });
  return ref;
};

const getResultsByQueryId = async (queryId) => {
  const snap = await db.collection('results')
    .where('queryId', '==', queryId)
    .get();

  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

module.exports = { createResult, getResultsByQueryId };
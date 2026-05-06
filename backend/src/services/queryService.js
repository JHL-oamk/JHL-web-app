const { db } = require('../config/firebaseAdmin');

const createQuery = async (uid, question) => {
  const ref = await db.collection('queries').add({
    userId: uid,
    question,
    status: 'pending',
    createdAt: new Date()
  });
  return ref;
};

const getUserQueries = async (uid) => {
  const snap = await db.collection('queries')
    .where('userId', '==', uid)
    .orderBy('createdAt', 'desc')
    .get();

  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

module.exports = { createQuery, getUserQueries };
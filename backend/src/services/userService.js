const { db } = require('../config/firebaseAdmin.js');

const createUser = async (uid, data) => {
  try {
    await db.collection('users').doc(uid).set(data, { merge: true });
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

const getUser = async (uid) => {
  try {
    const snap = await db.collection('users').doc(uid).get();
    return snap.exists ? snap.data() : null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

module.exports = { createUser, getUser };
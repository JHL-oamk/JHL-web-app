const { db } = require('../config/firebaseAdmin');

const getTopLaws = async (limit = 5) => {
  const usersSnap = await db.collection('users').get();
  const counts = {}; // key -> { name, link, count }

  for (const userDoc of usersSnap.docs) {
    const uid = userDoc.id;
    const chatsSnap = await db.collection('users').doc(uid).collection('chats').get();
    for (const chatDoc of chatsSnap.docs) {
      const data = chatDoc.data() || {};
      const context = Array.isArray(data.context) ? data.context : [];
      for (const src of context) {
        // expect { name, link }
        const key = src.link || src.url || src.fileUrl || src.name || JSON.stringify(src);
        if (!counts[key]) counts[key] = { name: src.name || src.title || key, link: src.link || src.url || src.fileUrl || null, count: 0 };
        counts[key].count += 1;
      }
    }
  }

  const arr = Object.values(counts).sort((a, b) => b.count - a.count);
  return arr.slice(0, limit);
};

module.exports = { getTopLaws };

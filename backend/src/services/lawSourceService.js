const { db } = require('../config/firebaseAdmin');

const LAW_SOURCES_COLLECTION = 'lawSources';

const saveLawSource = async ({ docId, title, fileUrl, fileName, content, apiContext, category, uploadedBy }) => {
  const docRef = db.collection(LAW_SOURCES_COLLECTION).doc(docId);

  let apiContextObj = {};
  if (apiContext && typeof apiContext === 'object') {
    apiContextObj = { ...apiContext };
  } else {
    apiContextObj = {
      api_context: typeof apiContext === 'string' ? apiContext : '',
      category: 'Muut asiakirjat',
      language: 'fi',
      type: 'law',
    };
  }

  const apiContextText = (typeof apiContextObj.api_context === 'string') ? apiContextObj.api_context : '';

  const docData = {
    active: true,
    api_context: apiContextText,
    // Käytä frontendin kategoriaa jos annettu, muuten Clauden ehdotusta
    category: category || apiContextObj.category || 'Muut asiakirjat',
    content: content || '',
    language: apiContextObj.language || 'fi',
    title: title || '',
    type: apiContextObj.type || 'law',
    url: fileUrl || '',
    fileUrl: fileUrl || '',
    uploadedBy: uploadedBy || null,
    uploadedAt: new Date().toISOString(),
  };

  await docRef.set(docData);

  return { id: docId, ...docData };
};

const deleteLawSourceByFileUrl = async (fileUrl) => {
  let variants = [fileUrl];
  try {
    const urlObj = new URL(fileUrl);
    if (urlObj.pathname) variants.push(urlObj.pathname);
  } catch (e) {
    // not a full URL, ignore
  }

  const deletedIds = [];

  for (const candidate of variants) {
    let snapshot = await db.collection(LAW_SOURCES_COLLECTION)
      .where('fileUrl', '==', candidate)
      .get();

    if (snapshot.empty) {
      snapshot = await db.collection(LAW_SOURCES_COLLECTION)
        .where('url', '==', candidate)
        .get();
    }

    if (!snapshot.empty) {
      const batch = db.batch();
      snapshot.forEach((doc) => {
        deletedIds.push(doc.id);
        batch.delete(doc.ref);
      });
      await batch.commit();
      break;
    }
  }

  return deletedIds;
};

module.exports = {
  saveLawSource,
  deleteLawSourceByFileUrl,
};
const { db } = require('../config/firebaseAdmin');

const LAW_SOURCES_COLLECTION = 'lawSources';

const saveLawSource = async ({ docId, title, fileUrl, fileName, content, apiContext, uploadedBy }) => {
  const docRef = db.collection(LAW_SOURCES_COLLECTION).doc(docId);

  // Normalize apiContext into expected shape (apiContext comes from generateApiContext)
  let apiContextObj = {};
  if (apiContext && typeof apiContext === 'object') {
    apiContextObj = { ...apiContext };
  } else {
    apiContextObj = {
      active: true,
      api_context: typeof apiContext === 'string' ? apiContext : '',
      category: 'Other Documents',
      content: content || '',
      language: '',
      title: title || '',
      type: 'law',
      url: fileUrl || '',
    };
  }

  // Ensure api_context is a string
  const apiContextText = (typeof apiContextObj.api_context === 'string') ? apiContextObj.api_context : '';

  const docData = {
    active: true,
    api_context: apiContextText,
    category: apiContextObj.category || 'Other Documents',
    content: content || '',
    language: apiContextObj.language || '',
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
  // Try to match both the provided fileUrl and its pathname (in case frontend sent absolute URL)
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

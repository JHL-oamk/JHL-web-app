/**
 * lawSizes.js
 * Näyttää kaikkien lakidokumenttien pituudet Firestoresta
 * 
 * Käyttö: node lawSizes.js
 */

const { db } = require('./src/config/firebaseAdmin');

async function showSizes() {
  const snapshot = await db.collection('lawSources')
    .where('active', '==', true)
    .get();

  const docs = snapshot.docs.map(doc => ({
    title: doc.data().title || doc.id,
    type: doc.data().type,
    chars: (doc.data().content || '').length,
  }));

  // Järjestä pituuden mukaan suurimmasta pienimpään
  docs.sort((a, b) => b.chars - a.chars);

  console.log('\n=== LAKIDOKUMENTTIEN PITUUDET ===\n');

  for (const doc of docs) {
    const bar = doc.chars > 50000 ? '🔴' : doc.chars > 30000 ? '🟡' : '🟢';
    const type = doc.type === 'tes_chunk' ? '[TES]' : doc.type === 'law_chunk' ? '[CHUNK]' : '[LAW]';
    console.log(`${bar} ${doc.chars.toLocaleString().padStart(7)} merkkiä  ${type} ${doc.title}`);
  }

  console.log('\n🔴 = yli 50k — pilko  🟡 = 30–50k — harkitse  🟢 = alle 30k — ok\n');
  console.log(`Yhteensä: ${docs.length} dokumenttia`);
}

showSizes().catch(console.error);
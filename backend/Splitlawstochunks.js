/**
 * splitLawsToChunks.js
 * 
 * Jakaa isot lakidokumentit chunkeiksi Firestoreen pykälänumeroiden perusteella.
 * 
 * Käyttö:
 *   node splitLawsToChunks.js --dry-run   (näyttää mitä tekisi, ei muuta mitään)
 *   node splitLawsToChunks.js             (tekee muutokset Firestoreen)
 */

const { db } = require('./src/config/firebaseAdmin');

const DRY_RUN = process.argv.includes('--dry-run');

// Määritä miten kukin laki pilkotaan
// Muokkaa näitä vastaamaan oikeita pykälänumeroita
const LAW_SPLIT_CONFIG = {
  'Tartuntatautilaki 1227/2016': [
    { title: 'Tartuntatautilaki — Yleiset säännökset ja viranomaiset (1–14 §)', startSection: 1, endSection: 14 },
    { title: 'Tartuntatautilaki — Terveystarkastukset ja pakolliset toimenpiteet (15–23 §)', startSection: 15, endSection: 23 },
    { title: 'Tartuntatautilaki — Rokotukset (44–53 §)', startSection: 44, endSection: 53 },
    { title: 'Tartuntatautilaki — Karanteeni ja eristys (60–67 §)', startSection: 60, endSection: 67 },
    { title: 'Tartuntatautilaki — Muutoksenhaku ja seuraamukset (85–100 §)', startSection: 85, endSection: 999 },
  ],
  'Työturvallisuuslaki 738/2002': [
    { title: 'Työturvallisuuslaki — Yleiset velvollisuudet (1–11 §)', startSection: 1, endSection: 11 },
    { title: 'Työturvallisuuslaki — Työn suunnittelu ja vaarojen arviointi (12–20 §)', startSection: 12, endSection: 20 },
    { title: 'Työturvallisuuslaki — Työntekijän velvollisuudet ja oikeudet (17–23 §)', startSection: 17, endSection: 23 },
    { title: 'Työturvallisuuslaki — Erityiset tilanteet ja biologiset vaarat (24–40 §)', startSection: 24, endSection: 40 },
    { title: 'Työturvallisuuslaki — Valvonta ja seuraamukset (41–65 §)', startSection: 41, endSection: 999 },
  ],
  'Laki potilaan asemasta ja oikeuksista 785/1992': [
    { title: 'Potilaslaki — Oikeus hoitoon ja tiedonsaanti (1–6 §)', startSection: 1, endSection: 6 },
    { title: 'Potilaslaki — Itsemääräämisoikeus, kiireellinen hoito ja alaikäiset (6–9 §)', startSection: 6, endSection: 9 },
    { title: 'Potilaslaki — Muistutus, kantelu ja potilasasiakirjat (10–18 §)', startSection: 10, endSection: 999 },
  ],
  'Vuosilomalaki 162/2005': [
    { title: 'Vuosilomalaki — Loman ansainta ja pituus (1–10 §)', startSection: 1, endSection: 10 },
    { title: 'Vuosilomalaki — Loman antaminen ja ajankohta (11–20 §)', startSection: 11, endSection: 20 },
    { title: 'Vuosilomalaki — Siirto, keskeytys ja korvaukset (21–30 §)', startSection: 21, endSection: 999 },
  ],
  'Työaikalaki 872/2019': [
    { title: 'Työaikalaki — Soveltamisala ja määritelmät (1–6 §)', startSection: 1, endSection: 6 },
    { title: 'Työaikalaki — Säännöllinen työaika ja joustot (7–15 §)', startSection: 7, endSection: 15 },
    { title: 'Työaikalaki — Ylityö ja korvaukset (16–23 §)', startSection: 16, endSection: 23 },
    { title: 'Työaikalaki — Lepoajat ja työvuoroluettelo (24–30 §)', startSection: 24, endSection: 30 },
    { title: 'Työaikalaki — Valvonta ja seuraamukset (31–42 §)', startSection: 31, endSection: 999 },
  ],
};

/**
 * Poimii pykälät tekstistä numeroalueen perusteella.
 * Etsii "X §" muotoisia otsikoita ja ottaa tekstiä väliltä.
 */
function extractSections(content, startSection, endSection) {
  const lines = content.split('\n');
  const result = [];
  let capturing = false;
  let currentSection = null;

  for (const line of lines) {
    // Etsi pykälän alkua: "12 §" tai "12 a §" muodossa
    const sectionMatch = line.match(/^(\d+)\s*[a-z]?\s*§/);
    if (sectionMatch) {
      const sectionNum = parseInt(sectionMatch[1]);
      currentSection = sectionNum;

      if (sectionNum >= startSection && sectionNum <= endSection) {
        capturing = true;
      } else if (sectionNum > endSection) {
        capturing = false;
      }
    }

    if (capturing) {
      result.push(line);
    }
  }

  return result.join('\n').trim();
}

async function splitLaws() {
  console.log(DRY_RUN ? '=== DRY RUN — ei muutoksia ===' : '=== TUOTANTOAJO — muuttaa Firestorea ===');
  console.log('');

  const snapshot = await db.collection('lawSources')
    .where('type', '==', 'law')
    .where('active', '==', true)
    .get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const config = LAW_SPLIT_CONFIG[data.title];

    if (!config) {
      console.log(`⏭  Ohitetaan: ${data.title}`);
      continue;
    }

    const content = data.content || '';
    console.log(`\n📄 Käsitellään: ${data.title} (${content.length} merkkiä)`);

    const chunks = [];
    for (const chunkConfig of config) {
      const chunkContent = extractSections(content, chunkConfig.startSection, chunkConfig.endSection);
      if (chunkContent.length < 100) {
        console.log(`  ⚠️  Chunk "${chunkConfig.title}" jäi tyhjäksi — tarkista pykälänumerot`);
        continue;
      }
      chunks.push({
        ...chunkConfig,
        content: chunkContent,
        chars: chunkContent.length,
      });
      console.log(`  ✅ ${chunkConfig.title} — ${chunkContent.length} merkkiä`);
    }

    if (chunks.length === 0) {
      console.log(`  ❌ Ei chunkkeja — ohitetaan`);
      continue;
    }

    if (!DRY_RUN) {
      // Luo uudet chunk-dokumentit
      for (const chunk of chunks) {
        const chunkDoc = {
          type: 'law_chunk',
          parent: data.title,
          title: chunk.title,
          content: chunk.content,
          active: true,
          category: data.category,
          url: data.url || '',
          language: data.language || 'fi',
          // api_context lisätään erikseen Firestoressa
          api_context: `Käytä tätä lähdettä kun kysymys koskee pykäliä ${chunk.startSection}–${chunk.endSection === 999 ? '+' : chunk.endSection} laista ${data.title}.`,
        };
        await db.collection('lawSources').add(chunkDoc);
        console.log(`  💾 Tallennettu: ${chunk.title}`);
      }

      // Deaktivoi alkuperäinen koko laki
      await db.collection('lawSources').doc(doc.id).update({ active: false });
      console.log(`  🔒 Deaktivoitu: ${data.title} (alkuperäinen)`);
    }
  }

  console.log('\n✅ Valmis.');
  if (DRY_RUN) {
    console.log('Aja ilman --dry-run tehdäksesi muutokset Firestoreen.');
  }
}

splitLaws().catch(console.error);
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, writeBatch } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Carrega variáveis do .env
const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) {
    let val = v.join('=').trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[k.trim()] = val;
  }
});

const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY || env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTHDOMAIN || env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_projectId || env.FIREBASE_PROJECT_ID || env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_storageBucket || env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_messagingSenderId || env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_appId || env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CACHE_FILE = path.resolve('scripts/base64_cache.json');
let completedMap = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    completedMap = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch (e) {}
}

function saveCache() {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(completedMap), 'utf8');
  } catch (e) {}
}

async function downloadImageAsBase64(url) {
  if (!url || !url.startsWith('http')) return null;
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(5000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
      }
    });
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    if (arrayBuffer.byteLength < 50 || arrayBuffer.byteLength > 400 * 1024) {
      // Ignora respostas vazias ou imagens acima de 400KB para proteger o limite do documento Firestore
      return null;
    }
    const contentType = res.headers.get('content-type') || 'image/webp';
    const buffer = Buffer.from(arrayBuffer);
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch {
    return null;
  }
}

async function runEnrichment() {
  console.log('=== ComixFlix -> Enriquecimento Massivo de Capas em Base64 no Firestore ===');
  console.log('Projeto Firebase:', firebaseConfig.projectId);

  const catalogPath = path.resolve('lib/data/scraped-catalog.json');
  const comics = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  console.log(`Total de edições no catálogo: ${comics.length}`);

  const pending = comics.filter(c => !completedMap[c.id] && c.url_capa);
  console.log(`Edições já enriquecidas com Base64: ${Object.keys(completedMap).length}`);
  console.log(`Edições pendentes: ${pending.length}\n`);

  if (pending.length === 0) {
    console.log('🎉 100% das edições já possuem imagem Base64 gravada no Firestore!');
    return;
  }

  const BATCH_SIZE = 15; // lotes seguros de 15 documentos (~700KB por batch, bem abaixo do limite de 10MB)
  let processedCount = 0;
  let successCount = 0;
  const startTime = Date.now();

  for (let i = 0; i < pending.length; i += BATCH_SIZE) {
    const chunk = pending.slice(i, i + BATCH_SIZE);

    // Download concorrente das 15 imagens
    const promises = chunk.map(async (comic) => {
      const base64 = await downloadImageAsBase64(comic.url_capa);
      return { comic, base64 };
    });

    const results = await Promise.all(promises);

    // Grava no Firestore via writeBatch novo
    const batch = writeBatch(db);
    let validInBatch = 0;

    for (const { comic, base64 } of results) {
      if (base64) {
        const comicRef = doc(db, 'comics', comic.id);
        batch.set(comicRef, {
          imagem_base64: base64,
          atualizado_em: new Date().toISOString()
        }, { merge: true });
        completedMap[comic.id] = true;
        validInBatch++;
        successCount++;
      } else {
        // Marca como tentado
        completedMap[comic.id] = 'skipped';
      }
    }

    if (validInBatch > 0) {
      let committed = false;
      let retries = 0;
      while (!committed && retries < 3) {
        try {
          await batch.commit();
          committed = true;
        } catch (err) {
          retries++;
          console.warn(`[Retry ${retries}/3] Firestore backoff:`, err.message);
          await new Promise(r => setTimeout(r, 1500 * retries));
        }
      }
    }

    processedCount += chunk.length;
    saveCache();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const speed = (processedCount / ((Date.now() - startTime) / 1000)).toFixed(1);
    const totalDone = Object.keys(completedMap).length;
    const percent = ((totalDone / comics.length) * 100).toFixed(1);

    if (processedCount % 75 === 0 || i + BATCH_SIZE >= pending.length) {
      console.log(`[Base64] ${percent}% (${totalDone}/${comics.length}) | Sucessos: ${successCount} | Velocidade: ${speed} ed/s | ${elapsed}s`);
    }

    // Intervalo de 150ms entre lotes
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\n🎉 Processamento de Base64 concluído! Total no banco: ${Object.keys(completedMap).length}`);
}

runEnrichment().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});

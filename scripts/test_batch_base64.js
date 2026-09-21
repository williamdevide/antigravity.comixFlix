const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

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

async function test() {
  console.log('--- Testando gravação de capa Base64 no Firestore ---');
  const catalog = JSON.parse(fs.readFileSync('lib/data/scraped-catalog.json', 'utf8'));
  const sample = catalog.find(c => c.editora.includes('Panini') && c.url_capa);

  console.log(`Baixando imagem de amostra: ${sample.titulo}`);
  console.log(`URL: ${sample.url_capa}`);

  const res = await fetch(sample.url_capa, { signal: AbortSignal.timeout(6000) });
  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get('content-type') || 'image/webp';
  const base64 = `data:${contentType};base64,${buffer.toString('base64')}`;

  console.log(`Tamanho do buffer: ${buffer.byteLength} bytes | Tamanho Base64: ${base64.length} chars`);

  const comicRef = doc(db, 'comics', sample.id);
  await setDoc(comicRef, {
    imagem_base64: base64,
    atualizado_em: new Date().toISOString()
  }, { merge: true });

  console.log('✅ Gravação com sucesso no Firestore!');

  // Validação de Leitura
  const snap = await getDoc(comicRef);
  const data = snap.data();
  console.log(`✅ Leitura confirmada! Campo imagem_base64 presente no Firestore: ${Boolean(data.imagem_base64)} (tamanho: ${data.imagem_base64?.length})`);
  process.exit(0);
}

test().catch(err => {
  console.error('Falha no teste:', err);
  process.exit(1);
});

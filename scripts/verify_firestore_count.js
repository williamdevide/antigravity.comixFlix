const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, collection, getCountFromServer } = require('firebase/firestore');
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

async function verify() {
  console.log('=== Verificação de Dados no Cloud Firestore ===');
  console.log('Projeto:', firebaseConfig.projectId);

  const metaRef = doc(db, 'system', 'metadata');
  const snap = await getDoc(metaRef);
  if (snap.exists()) {
    console.log('✅ Metadados encontrados no Firestore:');
    console.log(JSON.stringify(snap.data(), null, 2));
  } else {
    console.log('❌ Metadados não encontrados');
  }

  console.log('\nConsultando contagem de documentos na coleção comics...');
  const countSnap = await getCountFromServer(collection(db, 'comics'));
  console.log(`✅ TOTAL DE QUADRINHOS NO FIRESTORE: ${countSnap.data().count} DOCUMENTOS!`);
  process.exit(0);
}

verify().catch((err) => {
  console.error('Erro na verificação:', err);
  process.exit(1);
});

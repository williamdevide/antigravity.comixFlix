const fs = require('fs');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, setDoc, getDoc } = require('firebase/firestore');

// Load environment variables from .env
const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && !k.startsWith('#')) {
    let val = v.join('=').trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.substring(1, val.length - 1);
    }
    env[k.trim()] = val;
  }
});

const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTHDOMAIN,
  projectId: env.FIREBASE_projectId || env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_storageBucket,
  messagingSenderId: env.FIREBASE_messagingSenderId,
  appId: env.FIREBASE_appId,
};

console.log('Testing Firestore with project:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

(async () => {
  try {
    console.log('Writing test document to Firestore...');
    const testRef = doc(db, 'system', 'connection_test');
    await setDoc(testRef, {
      status: 'online',
      testedAt: new Date().toISOString(),
      platform: 'ComixFlix'
    });
    console.log('Successfully wrote to Firestore!');

    const snap = await getDoc(testRef);
    console.log('Read back from Firestore:', snap.data());

    console.log('Checking "comics" collection in Firestore...');
    const comicsCol = collection(db, 'comics');
    const comicsSnap = await getDocs(comicsCol);
    console.log('Total comics documents currently in Firestore:', comicsSnap.size);
  } catch (err) {
    console.error('Firestore Error:', err.message);
    if (err.code) console.error('Error Code:', err.code);
  }
})();

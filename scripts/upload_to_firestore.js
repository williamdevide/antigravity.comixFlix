const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, writeBatch, setDoc } = require('firebase/firestore');

// 1. Carrega credenciais do .env
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

console.log('=== ComixFlix -> Sincronização Massiva com Cloud Firestore ===');
console.log('Projeto Firebase:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadCatalog() {
  const catalogPath = path.resolve('lib/data/scraped-catalog.json');
  if (!fs.existsSync(catalogPath)) {
    console.error('Arquivo scraped-catalog.json não encontrado!');
    process.exit(1);
  }

  const comics = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  console.log(`Total de quadrinhos a enviar ao Firestore: ${comics.length}`);

  // Estatísticas por editora
  const bySite = {
    panini: comics.filter(c => c.source === 'panini').length,
    mythos: comics.filter(c => c.source === 'mythos').length,
    pipoca_nanquim: comics.filter(c => c.source === 'pipoca_nanquim').length,
    quadrinhos_cia: comics.filter(c => c.source === 'quadrinhos_cia').length,
  };
  console.log('Distribuição por editora:', bySite);

  const BATCH_SIZE = 400;
  const totalBatches = Math.ceil(comics.length / BATCH_SIZE);
  const t0 = Date.now();

  console.log(`\nIniciando envio em ${totalBatches} lotes (batches de até ${BATCH_SIZE} docs)...`);

  for (let b = 0; b < totalBatches; b++) {
    const chunk = comics.slice(b * BATCH_SIZE, (b + 1) * BATCH_SIZE);
    const batch = writeBatch(db);

    for (const comic of chunk) {
      // Cria ID determinístico e limpo
      const docId = comic.id || `${comic.source}-${comic.titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 80)}`;
      const docRef = doc(db, 'comics', docId);

      // Limpa valores undefined para o Firestore
      const cleanComic = {
        id: docId,
        titulo: comic.titulo || 'Sem título',
        editora: comic.editora || 'Independente',
        selo: comic.selo || null,
        preco_normal: typeof comic.preco_normal === 'number' ? comic.preco_normal : 34.9,
        preco_promocional: typeof comic.preco_promocional === 'number' ? comic.preco_promocional : null,
        data_lancamento: comic.data_lancamento || null,
        url_capa: comic.url_capa || '',
        url_backdrop: comic.url_backdrop || comic.url_capa || '',
        personagem_principal: comic.personagem_principal || null,
        resumo_sinopse: comic.resumo_sinopse || null,
        isbn: comic.isbn || null,
        numero_edicao: typeof comic.numero_edicao === 'number' ? comic.numero_edicao : null,
        serie: comic.serie || null,
        autores: Array.isArray(comic.autores) ? comic.autores : [],
        paginas: typeof comic.paginas === 'number' ? comic.paginas : null,
        formato: comic.formato || 'Formato Americano',
        disponibilidade: comic.disponibilidade || 'em_estoque',
        url_produto: comic.url_produto || '',
        source: comic.source || 'panini',
        tags: Array.isArray(comic.tags) ? comic.tags : [],
        destaque: !!comic.destaque,
        lancamento_semana: !!comic.lancamento_semana,
        sincronizado_em: new Date().toISOString()
      };

      batch.set(docRef, cleanComic, { merge: true });
    }

    await batch.commit();
    const percent = (((b + 1) / totalBatches) * 100).toFixed(1);
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(`[Lote ${b + 1}/${totalBatches}] ${percent}% concluído | ${Math.min((b + 1) * BATCH_SIZE, comics.length)} docs | ${elapsed}s`);
  }

  // Grava metadados do sistema no Firestore
  console.log('\nGravando metadados do sistema no documento system/metadata...');
  const metaRef = doc(db, 'system', 'metadata');
  await setDoc(metaRef, {
    totalComics: comics.length,
    bySite,
    lastScrapedAt: new Date().toISOString(),
    version: '2.5.5',
    status: 'online',
    plataforma: 'ComixFlix Oficial'
  });

  const totalTime = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n🎉 SUCESSO ABSOLUTO! ${comics.length} quadrinhos e metadados gravados no Firestore em ${totalTime}s!`);
}

uploadCatalog().catch(err => {
  console.error('Erro fatal no upload para Firestore:', err);
  process.exit(1);
});

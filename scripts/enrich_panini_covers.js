const fs = require('fs');
const https = require('https');
const path = require('path');

const CATALOG_PATH = path.resolve('lib/data/scraped-catalog.json');
const CACHE_PATH = path.resolve('scripts/panini_cover_cache.json');

// Load cache if exists
let cache = {};
if (fs.existsSync(CACHE_PATH)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
    console.log(`[Panini Enrich] Loaded ${Object.keys(cache).length} entries from cache.`);
  } catch (e) {
    cache = {};
  }
}

const cat = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
const panini = cat.filter(c => c.source === 'panini');

const FALLBACK_COVERS = new Set([
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_jkdg3vfttp2pvddp6ds0lpcn4l/-S500-FWEBP',
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_b45gh3gu3l3df1rn52t8h6fc0a/-S500-FWEBP',
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_co4j84gi7p17l7orvt1iaqs624/-S500-FWEBP',
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_k9sbf2ar0d04vf321tb8njrq0r/-S500-FWEBP',
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_hnlaoj7i1d1ofc09548a49mp07/-S500-FWEBP',
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_k626t2rt210n13mfenv4be5q2i/-S500-FWEBP'
]);

// Non-comic URL patterns
const NON_COMIC_PATTERNS = [
  /\/category\//,
  /\/catalog\//,
  /\/colecionaveis\//,
  /\/assinatura/,
  /\/promos/,
  /\/promoblack/,
  /\/novidades\//,
  /\/livros\//,
  /\/desconto-/,
  /\/home-/,
  /\/universo-/,
  /\/almanaques\//,
  /panini\.com\.br\/$/,
  /panini-comics$/,
  /dc-comics$/,
  /marvel$/,
  /planet-manga$/,
  /mauricio-de-sousa-catalogo$/,
  /batnuuvem$/,
  /colecionaveis$/,
  /hall-da-fama$/,
  /catalogo$/,
  /promocomics$/,
  /novidades$/,
  /cola-aqui$/,
  /eisner-awards$/,
  /panini-books$/,
  /faleconosco$/,
  /contato$/,
  /perguntas-frequentes$/,
  /politica-/,
  /termos-/,
  /custos-/,
  /regras-/,
  /checklist-/,
  /trocas-/,
  /noticias$/,
  /regulamentos$/,
  /panini-collectors$/,
  /album-de-figurinhas/,
  /envelope-de-figurinhas/,
  /cards-/,
  /card-game/,
  /box-de-figurinhas/,
  /blister-/,
  /porta-cards/,
  /lata-/,
  /adrenalyn/,
  /copa-do-mundo/,
  /fifa-/,
  /libertadores/,
  /futebol/,
  /p-87$/
];

const agent = new https.Agent({
  keepAlive: true,
  maxSockets: 14,
  timeout: 12000
});

async function fetchProduct(url, attempt = 1) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      agent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9',
        'Cache-Control': 'no-cache'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
        if (data.length > 250000) res.destroy();
      });
      res.on('close', async () => {
        if ((res.statusCode === 403 || res.statusCode === 502 || res.statusCode === 503) && attempt < 3) {
          await new Promise(r => setTimeout(r, 600 * attempt));
          return resolve(await fetchProduct(url, attempt + 1));
        }

        const titleMatch = data.match(/<title>([^<]+)<\/title>/i);
        const rawTitle = titleMatch ? titleMatch[1].trim() : null;
        const is404 = res.statusCode === 404 || !rawTitle || rawTitle.includes('404') || rawTitle.includes('Página não encontrada');

        const ogMatch = data.match(/property="og:image"\s+content="([^"]+)"/i);
        const priceMatch = data.match(/data-price-amount="([^"]+)"/i) || data.match(/class="price">R\$\s*([^<]+)<\/span>/i);

        let hiResImg = null;
        if (ogMatch && ogMatch[1].includes('cloudfront.net')) {
          hiResImg = ogMatch[1].replace(/-S\d+-/, '-S500-');
        }

        let price = null;
        if (priceMatch) {
          const num = parseFloat(priceMatch[1].replace(',', '.'));
          if (num > 0) price = num;
        }

        resolve({
          statusCode: res.statusCode,
          is404,
          title: is404 ? null : rawTitle.replace(/\s*\|\s*Panini.*$/i, '').trim(),
          coverUrl: hiResImg,
          price
        });
      });
      res.on('error', () => resolve({ is404: true }));
    });
    req.on('error', () => resolve({ is404: true }));
  });
}

function saveProgress() {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

(async () => {
  console.log('=== Iniciando Enriquecimento e Saneamento de Capas da Panini ===');

  // Identify items that need processing
  const itemsToProcess = [];
  const validRetained = [];
  const purged = [];

  for (const item of panini) {
    const url = item.url_produto || '';
    const isNonComic = NON_COMIC_PATTERNS.some(p => p.test(url)) || url.split('/').length > 4;
    if (isNonComic) {
      purged.push(item);
      continue;
    }

    const isFallback = FALLBACK_COVERS.has(item.url_capa);
    if (isFallback) {
      // If it's the genuine owner of Venom, keep it
      if (item.id === 'panini-venom-2025-09' || item.id === 'panini-venom-2025-03' || item.id === 'panini-venom-2025-10' || item.id === 'panini-venom-2025-13') {
        validRetained.push(item);
      } else {
        itemsToProcess.push(item);
      }
    } else {
      validRetained.push(item);
    }
  }

  console.log(`Total inicial Panini: ${panini.length}`);
  console.log(`Itens não-quadrinhos descartados (CMS/Categorias): ${purged.length}`);
  console.log(`Itens já com capa autêntica retidos: ${validRetained.length}`);
  console.log(`Itens a processar / atualizar capa: ${itemsToProcess.length}`);

  let updatedCount = 0;
  let cachedCount = 0;
  let deadCount = 0;
  let activeCount = 0;

  const queue = [...itemsToProcess];
  const t0 = Date.now();
  let completed = 0;

  async function worker(workerId) {
    while (queue.length > 0) {
      const item = queue.shift();
      const url = item.url_produto;

      let info = cache[url];
      if (!info) {
        info = await fetchProduct(url);
        cache[url] = info;
        updatedCount++;
      } else {
        cachedCount++;
      }

      completed++;

      if (info && !info.is404 && info.coverUrl) {
        activeCount++;
      } else {
        deadCount++;
      }

      if (completed % 100 === 0 || queue.length === 0) {
        saveProgress();
        const elapsedSec = Math.max(1, ((Date.now() - t0) / 1000)).toFixed(1);
        const rate = (completed / elapsedSec).toFixed(1);
        console.log(`[Progresso] ${completed}/${itemsToProcess.length} (${((completed/itemsToProcess.length)*100).toFixed(1)}%) | Ativos: ${activeCount} | 404/Mortos: ${deadCount} | Vel: ${rate} it/s`);
      }
    }
  }

  const CONCURRENCY = 14;
  const workers = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    workers.push(worker(i));
  }
  await Promise.all(workers);

  saveProgress();

  console.log('\n=== Reconstruindo Catálogo com Capas 1:1 ===');
  const enrichedComics = [];
  for (const item of itemsToProcess) {
    const info = cache[item.url_produto];
    if (info && !info.is404 && info.coverUrl) {
      enrichedComics.push({
        ...item,
        titulo: info.title || item.titulo,
        url_capa: info.coverUrl,
        url_backdrop: info.coverUrl,
        preco_normal: info.price || item.preco_normal
      });
    }
  }

  console.log('\n=== Processamento Concluído ===');
  console.log(`Itens processados: ${completed}`);
  console.log(`Enriquecidos com capa real: ${enrichedComics.length}`);
  console.log(`Descartados (URLs 404 / sem capa): ${deadCount}`);

  // Merge all valid Panini items
  const finalPanini = [...validRetained, ...enrichedComics];
  console.log(`Total final Panini autêntico: ${finalPanini.length}`);

  const uniqueCovers = new Set(finalPanini.map(c => c.url_capa));
  console.log(`Capas únicas Panini: ${uniqueCovers.size} de ${finalPanini.length} (${((uniqueCovers.size/finalPanini.length)*100).toFixed(1)}%)`);

  // Build final catalog preserving other publishers (Mythos, Pipoca, Quadrinhos na Cia)
  const otherPublishers = cat.filter(c => c.source !== 'panini');
  const finalCatalog = [...otherPublishers, ...finalPanini];

  fs.writeFileSync(CATALOG_PATH, JSON.stringify(finalCatalog, null, 2));
  console.log(`Catálogo completo atualizado em ${CATALOG_PATH} com ${finalCatalog.length} edições!`);
})();

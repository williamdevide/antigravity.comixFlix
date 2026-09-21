const fs = require('fs');

const cat = JSON.parse(fs.readFileSync('lib/data/scraped-catalog.json', 'utf8'));
const panini = cat.filter(c => c.source === 'panini' || (c.url_produto && c.url_produto.includes('panini.com.br')));

const coverCounts = {};
panini.forEach(c => { coverCounts[c.url_capa] = (coverCounts[c.url_capa] || 0) + 1; });

// Top duplicated covers that were fallbacks
const FALLBACK_COVERS = new Set([
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_jkdg3vfttp2pvddp6ds0lpcn4l/-S500-FWEBP',
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_b45gh3gu3l3df1rn52t8h6fc0a/-S500-FWEBP',
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_co4j84gi7p17l7orvt1iaqs624/-S500-FWEBP',
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_k9sbf2ar0d04vf321tb8njrq0r/-S500-FWEBP',
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_hnlaoj7i1d1ofc09548a49mp07/-S500-FWEBP',
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_k626t2rt210n13mfenv4be5q2i/-S500-FWEBP'
]);

// Non comic URL patterns
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

let nonComicCount = 0;
let validWithUniqueCover = 0;
let needsCoverUpdate = [];

for (const item of panini) {
  const url = item.url_produto || '';
  const isNonComic = NON_COMIC_PATTERNS.some(p => p.test(url)) || url.split('/').length > 4;
  if (isNonComic) {
    nonComicCount++;
    continue;
  }

  // Is this item using one of the fallback covers, BUT is not the original item that owns the cover?
  // Note: venom-2025-09 owns image_b45g, venom-2025-03 owns image_co4j, etc.
  const isFallback = FALLBACK_COVERS.has(item.url_capa);
  if (isFallback) {
    // Check if it's the actual owner
    if (item.id === 'panini-venom-2025-09' || item.id === 'panini-venom-2025-03' || item.id === 'panini-venom-2025-10' || item.id === 'panini-venom-2025-13') {
      validWithUniqueCover++;
    } else {
      needsCoverUpdate.push(item);
    }
  } else {
    validWithUniqueCover++;
  }
}

console.log('Total Panini in catalog:', panini.length);
console.log('Non-comic / CMS pages to PURGE:', nonComicCount);
console.log('Already have authentic unique covers:', validWithUniqueCover);
console.log('Need real cover update:', needsCoverUpdate.length);
console.log('Sum check:', nonComicCount + validWithUniqueCover + needsCoverUpdate.length);

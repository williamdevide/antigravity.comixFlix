const fs = require('fs');

const xml = fs.readFileSync('scripts/panini_sitemap.xml', 'utf8');
const urlBlocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)];

const withoutImage = [];
for (const match of urlBlocks) {
  const block = match[1];
  const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
  const imgLoc = block.match(/<image:loc>([^<]+)<\/image:loc>/)?.[1]?.trim();
  if (!imgLoc && loc) {
    withoutImage.push(loc);
  }
}

console.log('Total URLs without image:', withoutImage.length);

// Let's filter obvious non-products:
// 1. Has subpaths like /category/, /assinatura-paniniaa/, /mauricio-de-sousa-producoes/, /colecionaveis/, /panini-comics/
// 2. Slugs that are common categories or non-comic terms
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
  /promos$/,
  /promoblack$/,
  /hall-da-fama$/,
  /catalogo$/,
  /promocomics$/,
  /novidades$/,
  /cola-aqui$/,
  /eisner-awards$/,
  /panini-books$/,
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
  /futebol/
];

const categoryOrPromoUrls = [];
const potentialComicUrls = [];

for (const url of withoutImage) {
  const isNonComic = NON_COMIC_PATTERNS.some(pat => pat.test(url));
  if (isNonComic) {
    categoryOrPromoUrls.push(url);
  } else {
    potentialComicUrls.push(url);
  }
}

console.log('Category / Promo / Non-comic URLs filtered out:', categoryOrPromoUrls.length);
console.log('Potential Comic URLs remaining:', potentialComicUrls.length);

console.log('\nSample 15 filtered non-comics:');
categoryOrPromoUrls.slice(0, 15).forEach(u => console.log(' - [FILTERED]', u));

console.log('\nSample 15 potential comics:');
potentialComicUrls.slice(0, 15).forEach(u => console.log(' - [COMIC]', u));

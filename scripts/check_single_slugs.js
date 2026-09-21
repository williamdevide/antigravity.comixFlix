const fs = require('fs');

const xml = fs.readFileSync('scripts/panini_sitemap.xml', 'utf8');
const urlBlocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)];

let withSubpaths = 0;
let singleSlugsWithoutImage = [];
let withImage = [];

for (const match of urlBlocks) {
  const block = match[1];
  const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
  const imgLoc = block.match(/<image:loc>([^<]+)<\/image:loc>/)?.[1]?.trim();
  if (!loc) continue;

  const path = loc.replace('https://panini.com.br/', '').replace(/\/$/, '');
  if (imgLoc) {
    withImage.push({ loc, imgLoc, title: block.match(/<image:title>([^<]+)<\/image:title>/)?.[1]?.trim() });
  } else if (!path || path.includes('/')) {
    withSubpaths++;
  } else {
    singleSlugsWithoutImage.push(path);
  }
}

console.log('URLs with Image:', withImage.length);
console.log('Category subpaths (contains /):', withSubpaths);
console.log('Single slugs without image:', singleSlugsWithoutImage.length);

// Let's filter out known non-product single slugs
const NON_PRODUCT_SLUGS = new Set([
  '', 'panini-comics', 'dc-comics', 'marvel', 'planet-manga', 'mauricio-de-sousa-catalogo',
  'batnuuvem', 'colecionaveis', 'promos', 'promoblack', 'hall-da-fama', 'catalogo',
  'promocomics', 'novidades', 'cola-aqui', 'eisner-awards', 'panini-books', 'contato',
  'politica-de-privacidade', 'termos-e-condicoes', 'faq', 'quem-somos', 'trabalhe-conosco',
  'central-de-atendimento', 'desconto-dc', 'exclusivo-marvel', 'desconto-manga', 'desconto-saldao',
  'saldao', 'black-friday', 'assine-panini', 'home-marvel', 'home-dc', 'home-planetmanga',
  'home-disneycomics', 'home-mangas-animes', 'promo-cards-dc'
]);

const cleanSingleSlugs = singleSlugsWithoutImage.filter(s => !NON_PRODUCT_SLUGS.has(s) && !s.startsWith('desconto-') && !s.startsWith('promo-'));

console.log('Clean single slugs (probable actual products):', cleanSingleSlugs.length);
console.log('\nSample 30 clean single slugs:');
cleanSingleSlugs.slice(0, 30).forEach(s => console.log(' *', s));

const fs = require('fs');

const xml = fs.readFileSync('scripts/panini_sitemap.xml', 'utf8');
const urlBlocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)];

console.log('Total <url> blocks:', urlBlocks.length);

let withImage = [];
let withoutImage = [];
const imageCount = new Map();

for (const match of urlBlocks) {
  const block = match[1];
  const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
  const imgLoc = block.match(/<image:loc>([^<]+)<\/image:loc>/)?.[1]?.trim();
  const title = block.match(/<image:title>([^<]+)<\/image:title>/)?.[1]?.trim();
  const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim();

  if (imgLoc) {
    withImage.push({ loc, imgLoc, title, lastmod });
    imageCount.set(imgLoc, (imageCount.get(imgLoc) || 0) + 1);
  } else {
    withoutImage.push({ loc, lastmod });
  }
}

console.log('URLs WITH image in sitemap:', withImage.length);
console.log('Unique images among those:', imageCount.size);
console.log('URLs WITHOUT image in sitemap:', withoutImage.length);

// Check if any image is repeated in withImage
const repeatedImages = [...imageCount.entries()].filter(([img, count]) => count > 1);
console.log('Repeated images count in sitemap withImage:', repeatedImages.length);

// Analyze withoutImage URLs
console.log('\n--- First 30 URLs WITHOUT image in sitemap: ---');
withoutImage.slice(0, 30).forEach(u => console.log(' -', u.loc));

// Let's categorize withoutImage URLs:
let categoriesCount = 0;
let productSlugCount = 0;
let otherCount = 0;

const sampleProductSlugs = [];

for (const u of withoutImage) {
  const url = u.loc;
  const path = url.replace('https://panini.com.br/', '');
  if (!path || path.includes('/')) {
    categoriesCount++;
  } else if (path.length > 0) {
    productSlugCount++;
    if (sampleProductSlugs.length < 20) sampleProductSlugs.push({ path, url });
  } else {
    otherCount++;
  }
}

console.log('\nBreakdown of URLs without image:');
console.log(' - Subpaths / Categories (contains / or empty):', categoriesCount);
console.log(' - Single-slug URLs (potential products):', productSlugCount);

console.log('\nSample 20 single-slug URLs without image:');
sampleProductSlugs.forEach(s => console.log(' *', s.path));

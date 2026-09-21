const fs = require('fs');

const catalog = JSON.parse(fs.readFileSync('lib/data/scraped-catalog.json', 'utf-8'));
const paniniComics = catalog.filter(c => c.source === 'panini');
console.log(`Total Panini comics in catalog: ${paniniComics.length}`);

// Conta frequência de cada capa na Panini
const coverCounts = {};
paniniComics.forEach(c => {
  coverCounts[c.url_capa] = (coverCounts[c.url_capa] || 0) + 1;
});

// Identifica capas repetidas (frequência > 5)
const genericCovers = new Set(
  Object.entries(coverCounts)
    .filter(([url, count]) => count > 5)
    .map(([url]) => url)
);

const needsRealCover = paniniComics.filter(c => genericCovers.has(c.url_capa) || !c.url_capa);
const alreadyUnique = paniniComics.filter(c => !genericCovers.has(c.url_capa));

console.log(`Panini comics already with UNIQUE authentic covers: ${alreadyUnique.length}`);
console.log(`Panini comics with generic/repeated covers needing real cover: ${needsRealCover.length}`);

// Exemplos de URLs de quadrinhos que precisam da capa real
console.log('\nSample comics needing real cover:');
needsRealCover.slice(0, 10).forEach(c => console.log(`[${c.id}] ${c.titulo} -> ${c.url_produto}`));

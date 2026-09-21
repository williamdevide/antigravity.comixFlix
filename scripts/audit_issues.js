const fs = require('fs');

const catalog = JSON.parse(fs.readFileSync('lib/data/scraped-catalog.json', 'utf-8'));
console.log('Total comics in catalog:', catalog.length);

// 1. Diagnóstico de títulos com "Pr " ou "Pr-" ou problemas de Pré
const prMythos = catalog.filter(c => c.source === 'mythos' && (c.titulo.includes('Pr-') || c.titulo.includes('Pr ') || /\bPr\b/i.test(c.titulo)));
console.log('\nMythos comics with "Pr" pattern:', prMythos.length);
prMythos.slice(0, 10).forEach(c => console.log(' ->', c.id, '|', c.titulo));

// 2. Diagnóstico de Preços
const zeroPrice = catalog.filter(c => !c.preco_normal || c.preco_normal === 0);
console.log('\nComics with preco_normal === 0 or missing:', zeroPrice.length);
const zeroBySource = {
  panini: zeroPrice.filter(c => c.source === 'panini').length,
  mythos: zeroPrice.filter(c => c.source === 'mythos').length,
  pipoca_nanquim: zeroPrice.filter(c => c.source === 'pipoca_nanquim').length,
  quadrinhos_cia: zeroPrice.filter(c => c.source === 'quadrinhos_cia').length,
};
console.log('Zero price by source:', zeroBySource);

// 3. Diagnóstico de Capas repetidas ou genéricas
const coversCount = {};
catalog.forEach(c => {
  coversCount[c.url_capa] = (coversCount[c.url_capa] || 0) + 1;
});

const topCovers = Object.entries(coversCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);
console.log('\nTop repeated covers:');
topCovers.forEach(([url, count]) => console.log(` ${count}x: ${url.substring(0, 80)}...`));

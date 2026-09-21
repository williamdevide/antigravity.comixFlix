const fs = require('fs');

const catalog = JSON.parse(fs.readFileSync('lib/data/scraped-catalog.json', 'utf-8'));
const juliaComics = catalog.filter(c => c.personagem_principal === 'Júlia Kendall' || c.titulo.toLowerCase().includes('júlia') || c.titulo.toLowerCase().includes('julia'));

console.log('Total Júlia comics in catalog:', juliaComics.length);
let withTex = 0;
juliaComics.forEach(c => {
  if (c.url_capa.includes('tex')) {
    withTex++;
    console.log('STILL HAS TEX:', c.id, c.titulo, c.url_capa);
  }
});
console.log('Júlia comics with Tex cover:', withTex);

// Mostra 5 edições de Júlia
console.log('\nSample Júlia editions:');
juliaComics.slice(0, 5).forEach(c => {
  console.log(' -', c.titulo, '| Capa:', c.url_capa);
});

// Mostra Excepcionais X-Men
console.log('\nExcepcionais X-Men:');
const excepcionais = catalog.filter(c => c.titulo.toLowerCase().includes('excepciona'));
excepcionais.forEach(c => {
  console.log(' -', c.titulo, '| Capa:', c.url_capa);
});

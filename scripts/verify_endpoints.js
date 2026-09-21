const http = require('http');

function getUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
      res.on('error', reject);
    });
  });
}

(async () => {
  console.log('=== Teste de Validação Determinística dos Endpoints do ComixFlix ===\n');

  // 1. Home Page
  const home = await getUrl('http://localhost:3000');
  console.log('1. Home (/) Status:', home.status);
  console.log('   Contém link para Central de Scraping (/scraping):', home.data.includes('/scraping'));
  console.log('   Contém Seletor de Tema (theme):', home.data.includes('dark') || home.data.includes('theme') || home.data.includes('ThemeToggle'));

  // 2. Scraping Page
  const scraping = await getUrl('http://localhost:3000/scraping');
  console.log('\n2. Scraping (/scraping) Status:', scraping.status);
  console.log('   Menciona Panini:', scraping.data.includes('Panini'));
  console.log('   Menciona Mythos:', scraping.data.includes('Mythos'));
  console.log('   Menciona Pipoca & Nanquim:', scraping.data.includes('Pipoca & Nanquim'));
  console.log('   Menciona Quadrinhos na Cia:', scraping.data.includes('Quadrinhos na Cia'));

  // 3. Status API
  const statusApi = await getUrl('http://localhost:3000/api/scraper/status');
  console.log('\n3. Status API (/api/scraper/status) Status:', statusApi.status);
  try {
    const json = JSON.parse(statusApi.data);
    console.log('   Total Comics:', json.totalComics);
    console.log('   By Site:', json.bySite);
    console.log('   Metrics Panini:', json.metricsBySite?.panini);
    console.log('   Metrics Mythos:', json.metricsBySite?.mythos);
    console.log('   Metrics Pipoca:', json.metricsBySite?.pipoca_nanquim);
    console.log('   Metrics Quadrinhos na Cia:', json.metricsBySite?.quadrinhos_cia);
  } catch (e) {
    console.log('   Status API Output:', statusApi.data.substring(0, 200));
  }

  // 4. Comics API (Sample test)
  const comicsApi = await getUrl('http://localhost:3000/api/comics?limit=50&editora=Mythos');
  console.log('\n4. Comics API (/api/comics?editora=Mythos) Status:', comicsApi.status);
  try {
    const json = JSON.parse(comicsApi.data);
    const comics = json.comics || json;
    console.log('   Mythos comics returned:', comics.length);
    const preVendaComics = comics.filter(c => c.titulo.toLowerCase().includes('pr'));
    console.log('   Amostra de títulos com "Pré" na Mythos:');
    preVendaComics.slice(0, 5).forEach(c => console.log('    -', c.titulo));
    const badAccents = comics.filter(c => /pr\b/i.test(c.titulo) && !c.titulo.includes('Pré'));
    console.log('   Títulos com erro de corte ("Pr" sem acento):', badAccents.length);
  } catch (e) {
    console.log('   Comics API parse error:', e.message);
  }

  // 5. Explorar Page
  const explorar = await getUrl('http://localhost:3000/explorar');
  console.log('\n5. Explorar (/explorar) Status:', explorar.status);
  console.log('   Contém filtros de Selo e Editora:', explorar.data.includes('ComicFilters') || explorar.data.includes('Todos os Selos') || explorar.data.includes('Panini Comics'));
})();

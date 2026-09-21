const routes = [
  'http://localhost:3000/',
  'http://localhost:3000/explorar',
  'http://localhost:3000/explorar?editora=Quadrinhos+na+Cia',
  'http://localhost:3000/explorar?editora=Mythos+Editora',
  'http://localhost:3000/explorar?editora=Panini+Comics&selo=Marvel+Comics',
  'http://localhost:3000/scraping',
  'http://localhost:3000/colecao',
  'http://localhost:3000/perfil',
  'http://localhost:3000/api/scraper/status',
  'http://localhost:3000/api/comics',
];

async function checkRoutes() {
  console.log("=== TESTANDO ROTAS DA APLICAÇÃO EM PRODUÇÃO ===");
  let allOk = true;

  for (const url of routes) {
    try {
      const res = await fetch(url);
      const ok = res.status === 200;
      console.log(`[${ok ? 'OK ' : 'FAIL'}] HTTP ${res.status} -> ${url}`);
      if (!ok) allOk = false;

      if (url.includes('/api/scraper/status')) {
        const json = await res.json();
        console.log('       Metadados da API de status:', {
          totalComics: json.totalComics,
          sites: Object.keys(json.bySite || {}),
          quadrinhosCia: json.metricsBySite?.quadrinhos_cia
        });
      }

      if (url.includes('/api/comics')) {
        const json = await res.json();
        console.log('       Comics API total:', json.length || 0);
      }
    } catch (e) {
      console.error(`[ERRO] ${url}: ${e.message}`);
      allOk = false;
    }
  }

  if (allOk) {
    console.log("\n=== TODAS AS ROTAS FUNCIONANDO PERFEITAMENTE (HTTP 200) ===");
  } else {
    console.error("\n=== ALERTA: ALGUMA ROTA FALHOU ===");
    process.exit(1);
  }
}

checkRoutes();

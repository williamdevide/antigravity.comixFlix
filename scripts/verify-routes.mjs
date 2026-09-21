async function testRoutes() {
  const routes = [
    { path: '/scraping', mustInclude: ['Central de Scraping', 'Panini Brasil', 'Mythos Editora', 'Pipoca &amp; Nanquim', 'Já Tem', 'Encontrou', 'Faltam'] },
    { path: '/perfil', mustInclude: ['NÍVEL 5', 'CURADOR MESTRE', 'Patrimônio Estimado', 'Alternar visibilidade do patrimônio', 'Compartilhar Perfil'] },
    { path: '/series/batman-snyder', mustInclude: ['Batman: Fase Snyder &amp; Capullo', 'Completude da sua Estante', 'lacunas para completar', 'Corte das Corujas'] },
    { path: '/api/scraper/status', mustInclude: ['bySite', 'metricsBySite', 'panini', 'mythos', 'pipoca_nanquim'] },
    { path: '/explorar', mustInclude: ['Explorar Catálogo', 'Panini', 'Pipoca &amp; Nanquim'] },
  ];

  console.log('Verificando rotas ativas do servidor com HTML entities...\n');

  let allSuccess = true;
  for (const r of routes) {
    try {
      const res = await fetch(`http://localhost:3000${r.path}`);
      const text = await res.text();
      console.log(`[STATUS ${res.status}] ${r.path} (Tamanho: ${text.length} bytes)`);
      
      const missing = r.mustInclude.filter(word => !text.includes(word));
      if (missing.length === 0) {
        console.log(`  ✓ 100% dos termos encontrados: [${r.mustInclude.join(', ')}]`);
      } else {
        allSuccess = false;
        console.log(`  ⚠ Termos não encontrados: [${missing.join(', ')}]`);
      }
    } catch (err) {
      allSuccess = false;
      console.error(`  ❌ Falha na rota ${r.path}:`, err.message);
    }
  }

  if (allSuccess) {
    console.log('\n🎉 TODAS AS ROTAS E COMPONENTES RENDERIZARAM COM 100% DE SUCESSO!');
  }
}

testRoutes();

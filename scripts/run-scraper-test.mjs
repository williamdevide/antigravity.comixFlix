import { runFullScraperPipeline } from '../lib/scrapers/index.ts';

async function testPipeline() {
  console.log('Iniciando pipeline de teste do scraper...');
  const result = await runFullScraperPipeline((event) => {
    console.log(`[${event.site}] (${event.progress}%) ${event.message}`);
  });

  console.log('\n--- RESUMO DA EXECUÇÃO ---');
  console.log('Total Extraído:', result.summary.totalExtracted);
  console.log('Por Site:', result.summary.bySite);
  console.log('Erros:', result.summary.errors);
}

testPipeline().catch(console.error);

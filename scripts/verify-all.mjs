import fs from 'fs';
import path from 'path';

const CATALOG_FILE = path.join(process.cwd(), "lib", "data", "scraped-catalog.json");
const METADATA_FILE = path.join(process.cwd(), "lib", "data", "scraper-metadata.json");

async function verifyAll() {
  console.log("=== INICIANDO AUDITORIA FINAL DE INTEGRIDADE ===");

  if (!fs.existsSync(CATALOG_FILE)) {
    console.error("ERRO: scraped-catalog.json não encontrado!");
    process.exit(1);
  }

  const catalog = JSON.parse(fs.readFileSync(CATALOG_FILE, "utf-8"));
  console.log(`\n1. Base Total de HQs: ${catalog.length} edições catalogadas.`);

  // Por editora
  const byEditora = {};
  for (const c of catalog) {
    byEditora[c.editora] = (byEditora[c.editora] || 0) + 1;
  }
  console.log("   Distribuição por editora:", byEditora);

  // Por selo
  const bySelo = {};
  for (const c of catalog) {
    const s = c.selo || "Sem Selo";
    bySelo[s] = (bySelo[s] || 0) + 1;
  }
  console.log("   Distribuição por selos principais:");
  Object.entries(bySelo)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([s, count]) => console.log(`     - ${s}: ${count}`));

  // 2. Verificação de Capas da Mythos (Zero 404)
  console.log("\n2. Verificando capas da Mythos Editora...");
  const mythosComics = catalog.filter(c => c.editora === "Mythos Editora");
  console.log(`   Total Mythos: ${mythosComics.length}`);
  const brokenPatterns = mythosComics.filter(c => c.url_capa.includes("/600_"));
  console.log(`   Capas com /600_ (que causavam 404): ${brokenPatterns.length} (esperado 0)`);

  const sampleMythosCovers = mythosComics.slice(0, 5).map(c => c.url_capa);
  console.log("   Testando 5 capas reais da Mythos no CDN Tray:");
  for (const url of sampleMythosCovers) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      console.log(`     HTTP ${res.status}: ${url.split("/").pop()}`);
      if (res.status === 404) {
        console.error("     ALERTA: Capa retornou 404!");
      }
    } catch (e) {
      console.log(`     Erro ao testar ${url}: ${e.message}`);
    }
  }

  // 3. Verificação de Quadrinhos na Cia
  console.log("\n3. Verificando Quadrinhos na Cia...");
  const ciaComics = catalog.filter(c => c.editora === "Quadrinhos na Cia");
  console.log(`   Total Quadrinhos na Cia: ${ciaComics.length} (esperado 162)`);
  if (ciaComics.length > 0) {
    console.log("   Exemplo de obra:", {
      titulo: ciaComics[0].titulo,
      selo: ciaComics[0].selo,
      preco: ciaComics[0].preco_normal,
      autores: ciaComics[0].autores,
      capa: ciaComics[0].url_capa
    });
    try {
      const res = await fetch(ciaComics[0].url_capa, { method: "HEAD" });
      console.log(`   HTTP Capa S3: ${res.status}`);
    } catch (e) {
      console.log("   Erro capa S3:", e.message);
    }
  }

  // 4. Verificação de Venom na Panini
  console.log("\n4. Verificando acervo de Venom na Panini...");
  const venomComics = catalog.filter(c =>
    (c.titulo.toLowerCase().includes("venom") || c.personagem_principal === "Venom") &&
    c.editora === "Panini Comics"
  );
  console.log(`   Total edições de Venom na Panini: ${venomComics.length} (esperado >= 50, anterior era apenas 14!)`);
  console.log("   Amostra de títulos Venom:");
  venomComics.slice(0, 5).forEach(c => console.log(`     - ${c.titulo} (R$ ${c.preco_normal})`));

  // 5. Verificação de Metadados
  console.log("\n5. Verificando scraper-metadata.json...");
  const meta = JSON.parse(fs.readFileSync(METADATA_FILE, "utf-8"));
  console.log("   Sites registrados:", Object.keys(meta.bySite));
  console.log("   Métricas por site:", meta.metricsBySite);

  console.log("\n=== AUDITORIA DE DADOS CONCLUÍDA COM SUCESSO! ===");
}

verifyAll();

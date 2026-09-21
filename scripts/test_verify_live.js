async function verifyFinal() {
  console.log('=== VERIFICAÇÃO FINAL DA AUDITORIA ===\n');

  const res = await fetch('http://localhost:3000/api/comics');
  const comics = await res.json();
  console.log(`✓ Total de quadrinhos no catálogo: ${comics.length}`);

  // 1. Verificação de Preço Zero ou Faltando
  const zeroPrice = comics.filter(c => !c.preco_normal || c.preco_normal === 0);
  console.log(`\n[PREÇOS] Quadrinhos com preço 0 ou nulo: ${zeroPrice.length} (Esperado: 0)`);
  if (zeroPrice.length === 0) {
    console.log('✓ SUCESSO: Todos os quadrinhos possuem preços reais cadastrados!');
  }

  // 2. Verificação de "Pré-Venda" na Mythos
  const prMythos = comics.filter(c => c.source === 'mythos' && (c.titulo.includes('PR-VENDA') || c.titulo.includes('Pr-Venda') || /\bPr\b/i.test(c.titulo)));
  console.log(`\n[MYTHOS ACENTUAÇÃO] Quadrinhos com "PR-VENDA" ou "Pr" cortado: ${prMythos.length} (Esperado: 0)`);
  const preVendaMythos = comics.filter(c => c.source === 'mythos' && c.titulo.includes('Pré-Venda'));
  console.log(`[MYTHOS ACENTUAÇÃO] Quadrinhos com "Pré-Venda" acentuado corretamente: ${preVendaMythos.length}`);
  preVendaMythos.slice(0, 5).forEach(c => console.log(`  - ${c.titulo} | Preço: R$ ${c.preco_normal.toFixed(2)}`));

  // 3. Verificação de Júlia com capa de Tex
  const juliaComics = comics.filter(c => c.personagem_principal === 'Júlia Kendall' || c.titulo.includes('Júlia'));
  const juliaTex = juliaComics.filter(c => c.url_capa.toLowerCase().includes('tex'));
  console.log(`\n[MYTHOS CAPAS] Total de edições de Júlia: ${juliaComics.length}`);
  console.log(`[MYTHOS CAPAS] Júlia com capa de Tex: ${juliaTex.length} (Esperado: 0)`);

  // 4. Verificação de diversidade de capas e autenticidade na Panini
  const coversCount = {};
  comics.forEach(c => {
    coversCount[c.url_capa] = (coversCount[c.url_capa] || 0) + 1;
  });
  console.log(`\n[CAPAS] Total de capas únicas no catálogo: ${Object.keys(coversCount).length}`);

  // 5. Exemplo de edições de cada editora com capa e preço
  console.log('\n[AMOSTRAS COM PREÇO E CAPA]:');
  const samples = [
    comics.find(c => c.source === 'mythos' && c.titulo.includes('Júlia')),
    comics.find(c => c.source === 'mythos' && c.titulo.includes('Tex')),
    comics.find(c => c.source === 'mythos' && c.titulo.includes('Hellboy')),
    comics.find(c => c.source === 'panini' && c.titulo.includes('Excepcionais')),
    comics.find(c => c.source === 'panini' && c.titulo.includes('Venom (2025)')),
    comics.find(c => c.source === 'pipoca_nanquim'),
    comics.find(c => c.source === 'quadrinhos_cia'),
  ].filter(Boolean);

  samples.forEach(s => {
    console.log(`Editora: ${s.editora} | Título: ${s.titulo} | Preço: R$ ${s.preco_normal.toFixed(2)} | Capa: ${s.url_capa.substring(0, 70)}...`);
  });
}

verifyFinal();

const fs = require('fs');

async function testMythosListing() {
  console.log('--- TESTING MYTHOS LISTING ---');
  // Testa página 1 e 2 de hqs-livro
  const res = await fetch('https://www.lojamythos.com.br/hqs-livro?p=1', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const buf = await res.arrayBuffer();
  const html = new TextDecoder('iso-8859-1').decode(buf);

  // Procura produtos com preço e imagem
  const productBlocks = [...html.matchAll(/<li[^>]*class="[^"]*product[^"]*"[\s\S]*?<\/li>/gi)];
  console.log('Mythos products on page 1:', productBlocks.length);

  // Verifica estrutura de preço e título no HTML da Mythos
  for (const p of productBlocks.slice(0, 5)) {
    const titleM = p[0].match(/class="product-name"[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/i) || p[0].match(/alt="([^"]+)"/i);
    const imgM = p[0].match(/data-src="([^"]+)"/i) || p[0].match(/src="([^"]+)"/i);
    const priceM = p[0].match(/class="price"[^>]*>[\s\S]*?R\$\s*([^<]+)/i) || p[0].match(/R\$\s*([\d\.,]+)/i);
    console.log('Title:', titleM ? titleM[1].trim() : 'N/A');
    console.log('Img:', imgM ? imgM[1].trim() : 'N/A');
    console.log('Price:', priceM ? priceM[1].trim() : 'N/A');
    console.log('---');
  }

  // Verifica paginação máxima da Mythos
  const paginationM = html.match(/page=(\d+)/g) || html.match(/\?p=(\d+)/g);
  console.log('Pagination links found:', paginationM ? paginationM.slice(-5) : 'None');
}

async function testPaniniListing() {
  console.log('\n--- TESTING PANINI LISTING ---');
  const res = await fetch('https://panini.com.br/comics?p=1', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  console.log('Panini /comics status:', res.status);
  const html = await res.text();
  const productItems = [...html.matchAll(/<li[^>]*class="[^"]*product-item[^"]*"[\s\S]*?<\/li>/gi)];
  console.log('Panini product items on /comics p=1:', productItems.length);

  for (const item of productItems.slice(0, 5)) {
    const titleM = item[0].match(/class="product-item-link"[^>]*>([^<]+)<\/a>/i);
    const imgM = item[0].match(/class="product-image-photo"[^>]*src="([^"]+)"/i);
    const priceM = item[0].match(/data-price-amount="([^"]+)"/i) || item[0].match(/class="price">R\$\s*([^<]+)<\/span>/i);
    console.log('Title:', titleM ? titleM[1].trim() : 'N/A');
    console.log('Img:', imgM ? imgM[1].trim() : 'N/A');
    console.log('Price:', priceM ? priceM[1].trim() : 'N/A');
    console.log('---');
  }

  // Verifica quantas páginas existem na categoria /comics da Panini
  const pages = [...html.matchAll(/panini\.com\.br\/comics\?p=(\d+)/g)].map(m => parseInt(m[1]));
  console.log('Panini /comics max page in pagination:', pages.length > 0 ? Math.max(...pages) : 'N/A');
}

async function run() {
  await testMythosListing();
  await testPaniniListing();
}

run();

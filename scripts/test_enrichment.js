const fs = require('fs');

async function testEnrichment() {
  console.log('Testing Panini & Mythos category scraping...');

  // Panini Marvel
  const pRes = await fetch('https://panini.com.br/marvel?p=1', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const pHtml = await pRes.text();
  const pMatches = [...pHtml.matchAll(/<li[^>]*class="[^"]*product-item[^"]*"[\s\S]*?<\/li>/gi)];
  console.log(`Panini /marvel p=1 products: ${pMatches.length}`);

  // Mythos HQs
  const mRes = await fetch('https://www.lojamythos.com.br/hqs-livro?p=1', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const mBuf = await mRes.arrayBuffer();
  const mHtml = new TextDecoder('iso-8859-1').decode(mBuf);
  const mMatches = [...mHtml.matchAll(/<a href="([^"]+)" class="info-product">[\s\S]*?<div class="product-name">([^<]+)<\/div>[\s\S]*?<div class="box-price">([\s\S]*?)<\/div>/gi)];
  console.log(`Mythos /hqs-livro p=1 products: ${mMatches.length}`);
  for (const m of mMatches.slice(0, 3)) {
    const url = m[1];
    const title = m[2].trim();
    const priceBox = m[3];
    const priceM = priceBox.match(/R\$\s*([\d\.,]+)/);
    console.log(` - ${title} | Preço: ${priceM ? priceM[0] : 'N/A'} | URL: ${url}`);
  }
}

testEnrichment();

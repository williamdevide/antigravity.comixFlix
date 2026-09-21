const fs = require('fs');

async function checkMythosHtml() {
  console.log('Fetching Mythos https://www.lojamythos.com.br/hqs-livro ...');
  const res = await fetch('https://www.lojamythos.com.br/hqs-livro', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const buf = await res.arrayBuffer();
  const html = new TextDecoder('iso-8859-1').decode(buf);
  console.log('Mythos HTML length:', html.length);

  // Procura tags com preço
  const priceMatches = [...html.matchAll(/(?:R\$\s*[\d\.,]+)/g)].map(m => m[0]);
  console.log('Prices found in HTML:', priceMatches.slice(0, 10));

  // Procura tags de imagem de produtos (tcdn.com.br)
  const imgMatches = [...html.matchAll(/https:\/\/images\.tcdn\.com\.br\/img\/img_prod\/1119494\/[^\s"'>]+/gi)].map(m => m[0]);
  console.log('Total product images on page:', imgMatches.length);
  imgMatches.slice(0, 5).forEach(img => console.log('Img:', img));

  // Procura tags que contêm o nome do produto e preço
  const items = [...html.matchAll(/<div[^>]*class="[^"]*product[^"]*"[\s\S]*?<\/div>/gi)];
  console.log('Div product matches:', items.length);

  // Salva uma amostra do html da listagem para inspecionar
  fs.writeFileSync('scratch_mythos.html', html.substring(0, 40000));
}

async function checkPaniniCategories() {
  console.log('\nInspecting Panini sitemap for category/catalog URLs...');
  const xml = fs.readFileSync('scratch_panini_sitemap.xml', 'utf-8').catch?.(() => null);
  // Se não existir, faz fetch
  const res = await fetch('https://panini.com.br/sitemap.xml', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const text = await res.text();
  const locs = [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  console.log('Total locs in Panini sitemap:', locs.length);

  const categories = locs.filter(l => !l.match(/\/[a-z0-9-]+-[a-z0-9]+$/) && !l.includes('.html'));
  console.log('Possible category URLs in Panini:');
  categories.slice(0, 20).forEach(c => console.log(' ->', c));

  // Amostra de produtos no sitemap com <image:loc> e <image:title>
  const withImages = [...text.matchAll(/<url>[\s\S]*?<loc>([^<]+)<\/loc>[\s\S]*?<image:loc>([^<]+)<\/image:loc>[\s\S]*?(?:<image:title>([^<]+)<\/image:title>)?[\s\S]*?<\/url>/g)];
  console.log('\nPanini products with explicit image in sitemap:', withImages.length);
  withImages.slice(0, 5).forEach(m => {
    console.log('URL:', m[1]);
    console.log('IMG:', m[2]);
    console.log('TITLE:', m[3] || 'No title tag');
    console.log('---');
  });
}

async function main() {
  await checkMythosHtml();
  await checkPaniniCategories();
}

main();

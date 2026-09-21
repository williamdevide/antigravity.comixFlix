async function checkMythosPages() {
  console.log('Checking Mythos total pages...');
  let totalProducts = 0;
  for (let p = 1; p <= 18; p++) {
    const url = `https://www.lojamythos.com.br/hqs-livro?p=${p}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) break;
    const buf = await res.arrayBuffer();
    const html = new TextDecoder('iso-8859-1').decode(buf);
    const matches = [...html.matchAll(/<a href="([^"]+)" class="info-product">[\s\S]*?<div class="product-name">([^<]+)<\/div>[\s\S]*?<div class="box-price">([\s\S]*?)<\/div>/gi)];
    console.log(`Page ${p}: ${matches.length} products`);
    totalProducts += matches.length;
    if (matches.length === 0) break;
  }
  console.log(`Total authentic Mythos products collected across pages: ${totalProducts}`);
}

checkMythosPages();

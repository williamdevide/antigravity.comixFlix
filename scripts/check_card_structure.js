async function testPaniniCategory() {
  const url = 'https://panini.com.br/marvel?p=1';
  console.log('Fetching', url);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept-Language': 'pt-BR,pt;q=0.9',
    }
  });
  console.log('Status:', res.status);
  const html = await res.text();
  const items = [...html.matchAll(/<li[^>]*class="[^"]*product-item[^"]*"[\s\S]*?<\/li>/gi)];
  console.log('Items found on /marvel:', items.length);

  for (const item of items.slice(0, 5)) {
    const titleM = item[0].match(/class="product-item-link"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/i);
    const imgM = item[0].match(/class="product-image-photo"[^>]*src="([^"]+)"/i);
    const priceM = item[0].match(/data-price-amount="([^"]+)"/i) || item[0].match(/class="price">R\$\s*([^<]+)<\/span>/i);
    console.log('Title:', titleM ? titleM[2].trim() : 'N/A');
    console.log('Img:', imgM ? imgM[1].trim() : 'N/A');
    console.log('Price:', priceM ? priceM[1].trim() : 'N/A');
    console.log('---');
  }

  // Paginação
  const pages = [...html.matchAll(/class="page"[\s\S]*?<span>(\d+)<\/span>/g)].map(m => m[1]);
  console.log('Pagination numbers:', pages);
}

testPaniniCategory();

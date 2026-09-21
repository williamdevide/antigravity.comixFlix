const https = require('https');

async function testUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
        if (data.length > 50000) res.destroy();
      });
      res.on('close', () => {
        const ogImageMatch = data.match(/property="og:image"\s+content="([^"]+)"/i) || data.match(/name="twitter:image"\s+content="([^"]+)"/i);
        const titleMatch = data.match(/<title>([^<]+)<\/title>/i);
        const isProduct = data.includes('product-item-info') || data.includes('price-box') || data.includes('data-product-id') || data.includes('"@type":"Product"');
        resolve({
          status: res.statusCode,
          title: titleMatch ? titleMatch[1].trim() : null,
          ogImage: ogImageMatch ? ogImageMatch[1] : null,
          isProduct
        });
      });
      res.on('error', err => resolve({ error: err.message }));
    });
  });
}

(async () => {
  console.log('Testing real comic url:');
  const res1 = await testUrl('https://panini.com.br/boruto-naruto-next-generations-vol-18');
  console.log('Boruto 18:', res1);

  const res2 = await testUrl('https://panini.com.br/star-wars-cacadores-de-recompensas-vol-4');
  console.log('Star Wars:', res2);

  console.log('\nTesting category/landing page url:');
  const res3 = await testUrl('https://panini.com.br/panini-comics');
  console.log('Panini Comics Category:', res3);

  const res4 = await testUrl('https://panini.com.br/dc-comics');
  console.log('DC Comics Category:', res4);

  const res5 = await testUrl('https://panini.com.br/promos');
  console.log('Promos Category:', res5);
})();

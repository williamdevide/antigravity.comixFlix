const https = require('https');

const agent = new https.Agent({
  keepAlive: true,
  maxSockets: 8,
  timeout: 10000
});

const testSlugs = [
  'blue-lock-vol-31',
  'choujin-x-01',
  'absolute-superman-07',
  'batman-terra-um-omnibus',
  'vinland-saga-deluxe-vol-9'
];

async function fetchWithRetry(slug, attempt = 1) {
  return new Promise((resolve) => {
    const req = https.get(`https://panini.com.br/${slug}`, {
      agent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
        if (data.length > 250000) res.destroy();
      });
      res.on('close', async () => {
        if (res.statusCode === 403 && attempt < 3) {
          await new Promise(r => setTimeout(r, 600 * attempt));
          return resolve(await fetchWithRetry(slug, attempt + 1));
        }
        const ogImage = data.match(/property="og:image"\s+content="([^"]+)"/i);
        const title = data.match(/<title>([^<]+)<\/title>/i);
        const price = data.match(/data-price-amount="([^"]+)"/i) || data.match(/class="price">R\$\s*([^<]+)<\/span>/i);
        resolve({
          slug,
          status: res.statusCode,
          title: title ? title[1].trim() : null,
          ogImage: ogImage ? ogImage[1] : null,
          price: price ? price[1] : null
        });
      });
      res.on('error', (err) => resolve({ slug, error: err.message }));
    });
    req.on('error', (err) => resolve({ slug, error: err.message }));
  });
}

(async () => {
  for (const slug of testSlugs) {
    const res = await fetchWithRetry(slug);
    console.log(res);
  }
})();

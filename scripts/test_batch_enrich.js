const fs = require('fs');
const https = require('https');

const cat = JSON.parse(fs.readFileSync('lib/data/scraped-catalog.json', 'utf8'));
const panini = cat.filter(c => c.source === 'panini');

const FALLBACK_COVERS = new Set([
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_jkdg3vfttp2pvddp6ds0lpcn4l/-S500-FWEBP',
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_b45gh3gu3l3df1rn52t8h6fc0a/-S500-FWEBP',
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_co4j84gi7p17l7orvt1iaqs624/-S500-FWEBP',
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_k9sbf2ar0d04vf321tb8njrq0r/-S500-FWEBP',
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_hnlaoj7i1d1ofc09548a49mp07/-S500-FWEBP',
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_k626t2rt210n13mfenv4be5q2i/-S500-FWEBP'
]);

const sampleNeedsUpdate = panini.filter(c => FALLBACK_COVERS.has(c.url_capa)).slice(0, 50);

const agent = new https.Agent({
  keepAlive: true,
  maxSockets: 10,
  timeout: 12000
});

async function fetchProduct(url, attempt = 1) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      agent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9',
        'Cache-Control': 'no-cache'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
        if (data.length > 250000) res.destroy();
      });
      res.on('close', async () => {
        if ((res.statusCode === 403 || res.statusCode === 502 || res.statusCode === 503) && attempt < 3) {
          await new Promise(r => setTimeout(r, 800 * attempt));
          return resolve(await fetchProduct(url, attempt + 1));
        }

        const titleMatch = data.match(/<title>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : null;
        const is404 = res.statusCode === 404 || (title && (title.includes('404') || title.includes('Página não encontrada')));

        const ogMatch = data.match(/property="og:image"\s+content="([^"]+)"/i);
        const priceMatch = data.match(/data-price-amount="([^"]+)"/i) || data.match(/class="price">R\$\s*([^<]+)<\/span>/i);

        resolve({
          url,
          statusCode: res.statusCode,
          is404,
          title,
          ogImage: ogMatch ? ogMatch[1] : null,
          price: priceMatch ? priceMatch[1] : null
        });
      });
      res.on('error', (err) => resolve({ url, error: err.message, is404: false }));
    });
    req.on('error', (err) => resolve({ url, error: err.message, is404: false }));
  });
}

(async () => {
  console.log(`Testing batch of ${sampleNeedsUpdate.length} items with concurrency 8...`);
  const t0 = Date.now();
  let completed = 0;
  let success = 0;
  let notFound = 0;
  let failed = 0;

  const queue = [...sampleNeedsUpdate];

  async function worker() {
    while (queue.length > 0) {
      const item = queue.shift();
      const res = await fetchProduct(item.url_produto);
      completed++;
      if (res.statusCode === 200 && res.ogImage && !res.is404) {
        success++;
      } else if (res.is404) {
        notFound++;
      } else {
        failed++;
      }
    }
  }

  await Promise.all([
    worker(), worker(), worker(), worker(),
    worker(), worker(), worker(), worker()
  ]);

  const elapsed = (Date.now() - t0) / 1000;
  console.log(`\nBatch Results:`);
  console.log(`Total: ${completed} in ${elapsed.toFixed(1)}s (${(completed/elapsed).toFixed(1)} items/s)`);
  console.log(`Success (valid product + authentic cover): ${success}`);
  console.log(`404 Not Found (dead URLs): ${notFound}`);
  console.log(`Failed / Other: ${failed}`);
})();

const https = require('https');

const sampleSlugs = [
  'choujin-x-01',
  'blue-lock-vol-31',
  'absolute-superman-07',
  'vinland-saga-deluxe-vol-9',
  'batman-terra-um-omnibus',
  'a-saga-dos-x-men-vol-17',
  'wotakoi-o-amor-e-dificil-para-otakus-vol-8-amaer008r2',
  'noragami-vol-11-amawb011r2',
  'sword-art-online-moon-cradle-vol-19',
  'a-saga-da-liga-da-justica-vol-15',
  'a-saga-do-flash-04',
  'a-saga-do-homem-aranha-07',
  'aniquilacao-a-conquista-omnibus',
  'a-saga-dos-vingadores-02',
  'as-variantes',
  'avante-vingadores-2022-vol-14',
  'as-memorias-de-vanitas-08',
  'batman-superman-os-melhores-do-mundo-vol-11',
  'batman-09-91',
  'demolidor-vol-10'
];

async function fetchOne(slug) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = https.get(`https://panini.com.br/${slug}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
        if (data.length > 200000) res.destroy();
      });
      res.on('close', () => {
        const ogImage = data.match(/property="og:image"\s+content="([^"]+)"/i);
        const title = data.match(/<title>([^<]+)<\/title>/i);
        const is404 = res.statusCode === 404 || (title && title[1].includes('404'));
        resolve({
          slug,
          status: res.statusCode,
          elapsedMs: Date.now() - start,
          title: title ? title[1].trim() : null,
          hasOgImage: !!ogImage,
          ogImage: ogImage ? ogImage[1] : null,
          is404
        });
      });
      res.on('error', (err) => resolve({ slug, error: err.message }));
    });
    req.on('error', (err) => resolve({ slug, error: err.message }));
  });
}

(async () => {
  const t0 = Date.now();
  console.log('Testing 20 concurrent requests (concurrency 5)...');
  const results = [];
  const queue = [...sampleSlugs];

  async function worker() {
    while (queue.length > 0) {
      const slug = queue.shift();
      const res = await fetchOne(slug);
      results.push(res);
      console.log(`[${res.status}] ${res.slug} (${res.elapsedMs}ms) -> ${res.title} | img: ${res.hasOgImage}`);
    }
  }

  await Promise.all([worker(), worker(), worker(), worker(), worker()]);
  console.log(`\nFinished in ${(Date.now() - t0)/1000}s. Success: ${results.filter(r => r.status === 200 && r.hasOgImage).length}/${results.length}`);
})();

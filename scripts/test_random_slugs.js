const https = require('https');

const slugs = [
  'sandman-preludio-edicao-definitiva',
  'choujin-x-01',
  'blue-lock-vol-31',
  'absolute-superman-07',
  'vinland-saga-deluxe-vol-9'
];

async function checkSlug(slug) {
  return new Promise((resolve) => {
    const url = `https://panini.com.br/${slug}`;
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
        if (data.length > 300000) res.destroy();
      });
      res.on('close', () => {
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
  });
}

(async () => {
  for (const slug of slugs) {
    const res = await checkSlug(slug);
    console.log(res);
  }
})();

const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
      res.on('error', reject);
    });
  });
}

(async () => {
  console.log('Fetching robots.txt...');
  const robots = await fetchUrl('https://panini.com.br/robots.txt');
  console.log('robots.txt:\n', robots.data.substring(0, 1000));

  console.log('\nChecking sitemap...');
  const sitemapIndex = await fetchUrl('https://panini.com.br/sitemap.xml');
  console.log('sitemap status:', sitemapIndex.status);
  console.log('sitemap length:', sitemapIndex.data.length);
  console.log('sitemap first 1000 chars:\n', sitemapIndex.data.substring(0, 1000));
})();

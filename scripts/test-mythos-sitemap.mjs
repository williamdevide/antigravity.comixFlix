const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
};

async function testMythosSitemap() {
  const res = await fetch('https://www.lojamythos.com.br/loja/arquivos/1119494/sitemaps/sitemap_1.xml', { headers: BROWSER_HEADERS });
  const text = await res.text();
  const urls = [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
  console.log('Total URLs in Mythos sitemap:', urls.length);

  const productUrls = urls.filter(u => u.includes('/hq-s/') || u.includes('/livros/') || u.includes('/manga/'));
  console.log('Mythos comic/book URLs:', productUrls.length);
  console.log('Sample 10 Mythos URLs:', productUrls.slice(0, 10));
}

testMythosSitemap();

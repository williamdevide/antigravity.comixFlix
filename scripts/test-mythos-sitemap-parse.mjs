const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
};

async function testMythosSitemapParser() {
  const res = await fetch('https://www.lojamythos.com.br/loja/arquivos/1119494/sitemaps/sitemap_1.xml', { headers: BROWSER_HEADERS });
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
  
  const comicUrls = urls.filter(u => u.includes('/hq-s/') || u.includes('/livros/') || u.includes('/manga/'));
  console.log('Total Mythos comic URLs in sitemap:', comicUrls.length);

  const sample = comicUrls.slice(0, 10).map(u => {
    const slug = u.split('/').pop();
    const cleanTitle = slug
      .replace(/-no-/g, ' Nº ')
      .replace(/-ed-/g, ' Edição ')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
    return { u, slug, cleanTitle };
  });

  console.log('Sample parsed titles:', sample);
}

testMythosSitemapParser();

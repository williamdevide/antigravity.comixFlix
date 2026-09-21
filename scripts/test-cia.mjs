const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
};

async function testCia() {
  const testUrls = [
    'https://www.companhiadasletras.com.br/selo/quadrinhos-na-cia',
    'https://www.companhiadasletras.com.br/quadrinhos',
    'https://www.companhiadasletras.com.br/sitemap.xml',
    'https://www.companhiadasletras.com.br/busca?q=quadrinhos'
  ];

  for (const u of testUrls) {
    try {
      const res = await fetch(u, { headers: BROWSER_HEADERS });
      console.log(`URL: ${u} -> Status: ${res.status}`);
      if (res.ok) {
        const text = await res.text();
        console.log(`  Length: ${text.length}`);
        const title = text.match(/<title>([^<]+)<\/title>/i)?.[1];
        console.log(`  Title: ${title}`);
        if (u.includes('sitemap')) {
          const count = (text.match(/<loc>/g) || []).length;
          console.log(`  Sitemap loc tags: ${count}`);
        }
      }
    } catch (e) {
      console.error(`Error on ${u}:`, e.message);
    }
  }
}

testCia();

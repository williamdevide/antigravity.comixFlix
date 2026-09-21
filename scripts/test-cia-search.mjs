const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
};

async function testCiaSearch() {
  const urls = [
    'https://www.companhiadasletras.com.br/Busca?selo=QUADRINHOS+NA+CIA',
    'https://www.companhiadasletras.com.br/Busca?categoria=Quadrinhos',
    'https://www.companhiadasletras.com.br/Busca?q=quadrinhos+na+cia',
  ];

  for (const url of urls) {
    const res = await fetch(url, { headers: BROWSER_HEADERS });
    const html = await res.text();
    console.log(`URL: ${url} (HTTP ${res.status}, len: ${html.length})`);
    
    // Look for book titles or links: e.g. /livro/
    const links = [...html.matchAll(/href="(\/(?:livro|detalhe)[^"]+)"/gi)].map(m => m[1]);
    console.log('  Book links found:', links.length);
    if (links.length > 0) {
      console.log('  Sample links:', links.slice(0, 5));
    }

    // Look for covers:
    const covers = [...html.matchAll(/src="([^"]*(?:capa|livro|produto)[^"]*)"/gi)].map(m => m[1]);
    console.log('  Covers found:', covers.length);
    if (covers.length > 0) {
      console.log('  Sample covers:', covers.slice(0, 5));
    }
  }
}

testCiaSearch();

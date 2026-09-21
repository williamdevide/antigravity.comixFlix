const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
};

async function testCatalogo() {
  for (let pg = 1; pg <= 3; pg++) {
    const url = `https://www.lojamythos.com.br/loja/catalogo.php?loja=1119494&categoria=73&pg=${pg}`;
    const res = await fetch(url, { headers: BROWSER_HEADERS });
    const html = await res.text();
    const imgs = [...html.matchAll(/<img[^>]+data-src="([^"]*img\/img_prod\/1119494\/[^"]+)"[^>]+alt="([^"]+)"/gi)];
    console.log(`pg=${pg} imgs:`, imgs.length, 'sample 2:', imgs[1]?.[2]);
  }
}

testCatalogo();

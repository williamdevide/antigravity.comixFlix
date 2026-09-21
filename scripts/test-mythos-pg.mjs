const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
};

async function testMythosPg() {
  for (let pg = 1; pg <= 5; pg++) {
    const url = `https://www.lojamythos.com.br/hqs-livro?pg=${pg}`;
    const res = await fetch(url, { headers: BROWSER_HEADERS });
    const html = await res.text();
    const imgs = [...html.matchAll(/<img[^>]+data-src="([^"]*img\/img_prod\/1119494\/[^"]+)"[^>]+alt="([^"]+)"/gi)];
    const titles = imgs.map(m => m[2].trim());
    console.log(`Mythos pg=${pg} imgs:`, imgs.length, 'sample title:', titles[0]);
  }
}

testMythosPg();

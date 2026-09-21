const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
};

async function testMythosPagination() {
  for (let p = 1; p <= 5; p++) {
    const res = await fetch(`https://www.lojamythos.com.br/hqs-livro?p=${p}`, { headers: BROWSER_HEADERS });
    const text = await res.text();
    const imgs = [...text.matchAll(/<img[^>]+data-src="([^"]*img\/img_prod\/1119494\/[^"]+)"[^>]+alt="([^"]+)"/gi)];
    console.log(`Mythos /hqs-livro?p=${p} items:`, imgs.length);
    if (imgs.length === 0) break;
  }

  // Let's also check /hq-s/tex pagination
  for (let p = 1; p <= 5; p++) {
    const res = await fetch(`https://www.lojamythos.com.br/hq-s/tex?p=${p}`, { headers: BROWSER_HEADERS });
    const text = await res.text();
    const imgs = [...text.matchAll(/<img[^>]+data-src="([^"]*img\/img_prod\/1119494\/[^"]+)"[^>]+alt="([^"]+)"/gi)];
    console.log(`Mythos /hq-s/tex?p=${p} items:`, imgs.length);
    if (imgs.length === 0) break;
  }
}

testMythosPagination();

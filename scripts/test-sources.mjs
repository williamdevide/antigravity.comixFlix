const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
};

async function testPnPagination() {
  for (let p = 1; p <= 5; p++) {
    const url = `https://pipocaenanquim.com.br/quadrinhos.html?p=${p}`;
    const res = await fetch(url, { headers: BROWSER_HEADERS });
    const html = await res.text();
    const links = [...html.matchAll(/<a[^>]+class="product-item-link"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/gi)];
    console.log(`PN quadrinhos p=${p} status:${res.status} itens:${links.length}`);
    if (links.length === 0) break;
  }
}

testPnPagination();

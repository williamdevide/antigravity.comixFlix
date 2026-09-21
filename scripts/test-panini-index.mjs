const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
};

async function testIndexPagination() {
  let total = 0;
  for (let p = 1; p <= 8; p++) {
    const url = `https://panini.com.br/catalogsearch/result/index/?p=${p}&q=venom`;
    const res = await fetch(url, { headers: BROWSER_HEADERS });
    const html = await res.text();
    const items = [...html.matchAll(/class="product-item-link"[^>]*>([^<]+)<\/a>/gi)].map(m => m[1].trim());
    console.log(`Página ${p} (${url}): ${items.length} itens.`);
    total += items.length;
    if (items.length > 0) {
      console.log(`   Primeiro: ${items[0]}`);
    }
  }
  console.log(`TOTAL COLETADO: ${total}`);
}

testIndexPagination();

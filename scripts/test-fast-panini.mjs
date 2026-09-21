const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
};

async function testPage(p) {
  const url = `https://panini.com.br/catalogsearch/result/?p=${p}&q=venom`;
  console.log(`Buscando página ${p}: ${url}`);
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, { headers: BROWSER_HEADERS, signal: controller.signal });
    clearTimeout(t);
    console.log(`  Página ${p} HTTP ${res.status}`);
    const html = await res.text();
    const items = [...html.matchAll(/<li[^>]*class="[^"]*product-item[^"]*"[\s\S]*?<\/li>/gi)];
    console.log(`  Página ${p} itens encontrados: ${items.length}`);
    if (items.length > 0) {
      const firstTitle = items[0][0].match(/class="product-item-link"[^>]*>([^<]+)<\/a>/i);
      console.log(`  Primeiro: ${firstTitle ? firstTitle[1].trim() : 'n/a'}`);
    }
  } catch (e) {
    console.log(`  Página ${p} erro:`, e.message);
  }
}

async function run() {
  await testPage(1);
  await testPage(2);
}

run();

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
};

async function inspectVenomSearch() {
  const allVenoms = new Map();

  for (let p = 1; p <= 12; p++) {
    const url = `https://panini.com.br/catalogsearch/result/?p=${p}&q=venom`;
    try {
      const res = await fetch(url, { headers: BROWSER_HEADERS });
      if (!res.ok) break;
      const html = await res.text();
      const items = [...html.matchAll(/<li[^>]*class="[^"]*product-item[^"]*"[\s\S]*?<\/li>/gi)];
      console.log(`Página ${p}: ${items.length} itens.`);
      if (items.length === 0) break;

      for (const it of items) {
        const titleM = it[0].match(/class="product-item-link"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/i);
        const imgM = it[0].match(/<img[^>]*class="product-image-photo"[^>]*src="([^"]+)"/i);
        const priceM = it[0].match(/data-price-amount="([^"]+)"/i) || it[0].match(/class="price">R\$\s*([^<]+)<\/span>/i);
        if (titleM) {
          const url = titleM[1].trim();
          const title = titleM[2].trim();
          const img = imgM ? imgM[1].trim().replace(/-S\d+-/, "-S500-") : "";
          const price = priceM ? parseFloat(priceM[1].replace(",", ".")) : 0;
          allVenoms.set(url, { title, url, img, price });
        }
      }
    } catch (e) {
      console.log(`Erro p=${p}:`, e.message);
    }
  }

  console.log(`Total edições únicas coletadas da busca Venom: ${allVenoms.size}`);
  const sample = Array.from(allVenoms.values()).slice(0, 5);
  console.log("Amostra:", sample);
}

inspectVenomSearch();

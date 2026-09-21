const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
};

async function scrapeAllVenoms() {
  const venoms = [];
  for (let p = 1; p <= 10; p++) {
    const url = `https://panini.com.br/catalogsearch/result/index/?p=${p}&q=venom`;
    const res = await fetch(url, { headers: BROWSER_HEADERS });
    if (!res.ok) break;
    const html = await res.text();

    const items = [...html.matchAll(/<li[^>]*class="[^"]*product-item[^"]*"[\s\S]*?<\/li>/gi)];
    if (items.length === 0) break;

    for (const itemMatch of items) {
      const itemHtml = itemMatch[0];
      const titleM = itemHtml.match(/class="product-item-link"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/i);
      const imgM = itemHtml.match(/<img[^>]*class="product-image-photo"[^>]*src="([^"]+)"/i);
      const priceM = itemHtml.match(/data-price-amount="([^"]+)"/i) || itemHtml.match(/class="price">R\$\s*([^<]+)<\/span>/i);

      if (titleM && imgM) {
        const prodUrl = titleM[1].trim();
        const rawTitle = titleM[2].trim();
        const rawImg = imgM[1].trim();
        const price = priceM ? parseFloat(priceM[1].replace(",", ".")) : 0;
        
        // Alta resolução: trocar -S170- por -S500-
        const hiResImg = rawImg.replace(/-S\d+-/, "-S500-");

        venoms.push({
          title: rawTitle,
          url: prodUrl,
          img: hiResImg,
          price
        });
      }
    }
  }

  console.log('Total Venom editions scraped from search:', venoms.length);
  const uniqueUrls = new Set(venoms.map(v => v.url));
  console.log('Unique Venom editions:', uniqueUrls.size);
  console.log('Sample venoms:', venoms.slice(0, 3));
}

scrapeAllVenoms();

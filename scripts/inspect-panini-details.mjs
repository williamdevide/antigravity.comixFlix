const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
};

async function inspectPaniniDetails() {
  // 1. Check media/sitemap.xml
  try {
    const res = await fetch("https://panini.com.br/media/sitemap.xml", { headers: BROWSER_HEADERS });
    console.log('media/sitemap.xml HTTP:', res.status);
    if (res.ok) {
      const xml = await res.text();
      console.log('media/sitemap.xml len:', xml.length);
      console.log('preview:', xml.slice(0, 500));
    }
  } catch (e) {
    console.log('media/sitemap error:', e.message);
  }

  // 2. Inspecionar página de busca por venom
  try {
    const searchRes = await fetch("https://panini.com.br/catalogsearch/result/?q=venom", { headers: BROWSER_HEADERS });
    const html = await searchRes.text();
    
    // Look for toolbar amount (e.g. "86 itens" or "86 resultados")
    const amountMatch = html.match(/toolbar-amount[^>]*>([\s\S]*?)<\/span>/i) || html.match(/toolbar-number[^>]*>([\s\S]*?)<\/p>/i);
    console.log('Toolbar amount snippet:', amountMatch ? amountMatch[0] : 'not found');

    // Extrair produtos da página 1
    const items = [...html.matchAll(/<li[^>]*class="[^"]*product-item[^"]*"[\s\S]*?<\/li>/gi)];
    console.log('Found product-item lis:', items.length);

    if (items.length > 0) {
      const first = items[0][0];
      const titleM = first.match(/class="product-item-link"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/i) || first.match(/<a[^>]*class="product-item-link"[^>]*>([^<]+)<\/a>/i);
      const imgM = first.match(/<img[^>]*class="product-image-photo"[^>]*src="([^"]+)"/i) || first.match(/<img[^>]*src="([^"]+)"/i);
      const priceM = first.match(/data-price-amount="([^"]+)"/i) || first.match(/class="price">([^<]+)<\/span>/i);

      console.log('Item 1 info:', {
        title: titleM ? titleM[2] || titleM[1] : null,
        url: titleM ? titleM[1] : null,
        img: imgM ? imgM[1] : null,
        price: priceM ? priceM[1] : null
      });
    }

    // Look for pagination
    const pages = [...html.matchAll(/class="[^"]*page[^"]*"[\s\S]*?href="([^"]+)"/gi)].map(m => m[1]);
    console.log('Pagination links:', [...new Set(pages)]);
  } catch (e) {
    console.log('Search error:', e.message);
  }
}

inspectPaniniDetails();

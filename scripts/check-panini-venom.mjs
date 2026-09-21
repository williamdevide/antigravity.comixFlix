const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
};

async function checkPanini() {
  // 1. Check sitemap for venom
  console.log('1. Fetching Panini sitemap...');
  const res = await fetch("https://panini.com.br/sitemap.xml", { headers: BROWSER_HEADERS });
  const xml = await res.text();
  console.log('Sitemap size:', xml.length);
  
  const allLocs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  console.log('Total URLs in sitemap:', allLocs.length);

  const venomInSitemap = allLocs.filter(u => u.toLowerCase().includes('venom'));
  console.log('Venom URLs in sitemap.xml:', venomInSitemap.length);
  console.log('Samples:', venomInSitemap.slice(0, 10));

  const withImages = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].filter(m => m[1].includes('<image:loc>'));
  console.log('Total entries with <image:loc> in sitemap:', withImages.length);

  const venomWithImages = withImages.filter(m => m[1].toLowerCase().includes('venom'));
  console.log('Venom entries with <image:loc> in sitemap:', venomWithImages.length);

  // 2. Check robots.txt for other sitemaps
  console.log('\n2. Fetching Panini robots.txt...');
  try {
    const robRes = await fetch("https://panini.com.br/robots.txt", { headers: BROWSER_HEADERS });
    const robText = await robRes.text();
    const sitemaps = [...robText.matchAll(/sitemap:\s*([^\r\n]+)/gi)].map(m => m[1]);
    console.log('Sitemaps in robots.txt:', sitemaps);
  } catch (e) {
    console.log('Error robots:', e.message);
  }

  // 3. Check Panini search for venom
  console.log('\n3. Fetching Panini search for venom...');
  try {
    const searchRes = await fetch("https://panini.com.br/catalogsearch/result/?q=venom", { headers: BROWSER_HEADERS });
    console.log('Search HTTP:', searchRes.status);
    const searchHtml = await searchRes.text();
    console.log('Search HTML len:', searchHtml.length);
    const prodItems = [...searchHtml.matchAll(/class="item product product-item"[\s\S]*?<\/li>/gi)];
    console.log('Product items in search page 1:', prodItems.length);
    // Look for total count
    const totalMatch = searchHtml.match(/toolbar-number[^>]*>(\d+)</i) || searchHtml.match(/(\d+)\s*(?:itens|produtos|resultados)/i);
    console.log('Search total count match:', totalMatch ? totalMatch[0] : 'not found');
  } catch (e) {
    console.log('Search error:', e.message);
  }
}

checkPanini();

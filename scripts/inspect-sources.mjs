const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
};

async function inspectMythos() {
  console.log('--- Inspecionando Mythos ---');
  const res = await fetch('https://www.lojamythos.com.br/hq-s/tex-ed-ouro-no-091', { headers: BROWSER_HEADERS });
  console.log('Mythos product HTTP status:', res.status);
  const text = await res.text();
  
  const title = text.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  console.log('Title:', title);
  
  const ogImage = text.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i)?.[1];
  console.log('og:image:', ogImage);

  const priceMatch = text.match(/data-sell-price=["']([^"']+)["']|class=["'][^"']*preco-por[^"']*["'][^>]*>([\s\S]*?)<\/|itemprop=["']price["']\s+content=["']([^"']+)["']/i);
  console.log('price match:', priceMatch?.[0]);

  // Let's also inspect pagination or catalog listing of Mythos
  const catRes = await fetch('https://www.lojamythos.com.br/hq-s?p=1', { headers: BROWSER_HEADERS });
  const catText = await catRes.text();
  const catProducts = [...catText.matchAll(/<li[^>]*class=["'][^"']*item[^"']*["'][^>]*>([\s\S]*?)<\/li>/gi)];
  console.log('Mythos /hq-s?p=1 products in list:', catProducts.length);
}

async function inspectPaniniSitemapDetails() {
  console.log('--- Inspecionando Panini sitemap sample ---');
  const res = await fetch('https://panini.com.br/sitemap.xml', { headers: BROWSER_HEADERS });
  const text = await res.text();
  const urls = [...text.matchAll(/<url>([\s\S]*?)<\/url>/g)];
  const withImages = urls.filter(u => u[1].includes('<image:loc>'));
  console.log('Panini total urls with images:', withImages.length);

  for (let i = 0; i < 5; i++) {
    const u = withImages[i][1];
    const loc = u.match(/<loc>([^<]+)<\/loc>/)?.[1];
    const imgLoc = u.match(/<image:loc>([^<]+)<\/image:loc>/)?.[1];
    const imgTitle = u.match(/<image:title>([^<]+)<\/image:title>/)?.[1];
    const lastMod = u.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    console.log(`Panini item #${i + 1}:`, { loc, imgTitle, imgLoc: imgLoc?.substring(0, 60), lastMod });
  }
}

async function inspectPipocaNanquim() {
  console.log('--- Inspecionando Pipoca & Nanquim ---');
  let total = 0;
  for (let p = 1; p <= 6; p++) {
    const res = await fetch(`https://pipocaenanquim.com.br/quadrinhos.html?p=${p}`, { headers: BROWSER_HEADERS });
    const text = await res.text();
    const matches = [...text.matchAll(/<a[^>]+class="product-item-link"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)];
    console.log(`PN quadrinhos p=${p} matches:`, matches.length);
    total += matches.length;
    if (matches.length === 0) break;
  }
  for (let p = 1; p <= 3; p++) {
    const res = await fetch(`https://pipocaenanquim.com.br/mangas.html?p=${p}`, { headers: BROWSER_HEADERS });
    const text = await res.text();
    const matches = [...text.matchAll(/<a[^>]+class="product-item-link"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)];
    console.log(`PN mangas p=${p} matches:`, matches.length);
    total += matches.length;
    if (matches.length === 0) break;
  }
  console.log('Total PN items detected:', total);
}

async function run() {
  await inspectPaniniSitemapDetails();
  await inspectMythos();
  await inspectPipocaNanquim();
}

run();

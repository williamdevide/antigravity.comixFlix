const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
};

async function testPaniniSitemapFilter() {
  const res = await fetch('https://panini.com.br/sitemap.xml', { headers: BROWSER_HEADERS });
  const text = await res.text();
  const urls = [...text.matchAll(/<url>([\s\S]*?)<\/url>/g)];
  console.log('Total URLs in Panini sitemap:', urls.length);

  const comics = [];
  for (const match of urls) {
    const block = match[1];
    if (!block.includes('<image:loc>')) continue;

    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
    const imgLoc = block.match(/<image:loc>([^<]+)<\/image:loc>/)?.[1]?.trim();
    const title = block.match(/<image:title>([^<]+)<\/image:title>/)?.[1]?.trim();
    const lastMod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim();

    if (!loc || !imgLoc || !title) continue;

    // Filter out obvious non-comic merchandise if any (stickers/álbum de figurinhas, though albums can be comics, but let's see)
    comics.push({ loc, imgLoc, title, lastMod });
  }

  console.log('Valid Panini items with image and title:', comics.length);
  console.log('Sample 10 items:');
  console.log(comics.slice(0, 10).map(c => `${c.title} -> ${c.imgLoc.substring(0, 70)}`));
}

testPaniniSitemapFilter();

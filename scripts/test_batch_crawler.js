const fs = require('fs');

async function testFastBatchCrawler() {
  const catalog = JSON.parse(fs.readFileSync('lib/data/scraped-catalog.json', 'utf-8'));
  const paniniComics = catalog.filter(c => c.source === 'panini');

  // Capas repetidas frequentes
  const counts = {};
  paniniComics.forEach(c => counts[c.url_capa] = (counts[c.url_capa] || 0) + 1);
  const repeated = paniniComics.filter(c => counts[c.url_capa] > 5 && c.url_produto && !c.url_produto.endsWith('/'));

  console.log(`Total needing real cover: ${repeated.length}`);
  const sample = repeated.slice(0, 50);

  const t0 = Date.now();
  let success = 0;
  let notFound = 0;

  // Lote concorrente com pool de 15
  const CONCURRENCY = 15;
  for (let i = 0; i < sample.length; i += CONCURRENCY) {
    const chunk = sample.slice(i, i + CONCURRENCY);
    await Promise.all(chunk.map(async (comic) => {
      try {
        const res = await fetch(comic.url_produto, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept-Language': 'pt-BR,pt;q=0.9',
          },
          signal: AbortSignal.timeout(5000)
        });
        if (res.ok) {
          const html = await res.text();
          const ogImg = html.match(/property="og:image"[^>]+content="([^"]+)"/i)?.[1];
          const cloudfrontImg = html.match(/https:\/\/d14d9vp3wdof84\.cloudfront\.net\/image\/[^\s"'>]+/i)?.[0];
          const realImg = ogImg || cloudfrontImg;
          if (realImg && !realImg.includes('placeholder')) {
            success++;
          } else {
            notFound++;
          }
        } else {
          notFound++;
        }
      } catch (e) {
        notFound++;
      }
    }));
  }

  const elapsed = (Date.now() - t0) / 1000;
  console.log(`Processed 50 items in ${elapsed.toFixed(1)}s.`);
  console.log(`Success: ${success}, Not found / placeholder: ${notFound}`);
  console.log(`Average speed: ${(50 / elapsed).toFixed(1)} products per second!`);
}

testFastBatchCrawler();

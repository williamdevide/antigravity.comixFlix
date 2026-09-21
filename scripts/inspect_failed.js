const fs = require('fs');

async function inspectFailedItems() {
  const catalog = JSON.parse(fs.readFileSync('lib/data/scraped-catalog.json', 'utf-8'));
  const paniniComics = catalog.filter(c => c.source === 'panini');
  const counts = {};
  paniniComics.forEach(c => counts[c.url_capa] = (counts[c.url_capa] || 0) + 1);
  const repeated = paniniComics.filter(c => counts[c.url_capa] > 5 && c.url_produto && !c.url_produto.endsWith('/'));

  const sample = repeated.slice(0, 20);

  for (const item of sample) {
    try {
      const res = await fetch(item.url_produto, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(4000)
      });
      const html = await res.text();
      const is404 = res.status === 404 || html.includes('Página não encontrada') || html.includes('404');
      const isPlaceholder = html.includes('placeholder/default/panini-placeholder.png');
      const title = html.match(/<h1[^>]*class="page-title"[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>/i)?.[1] ||
                    html.match(/<title>([^<]+)<\/title>/i)?.[1];
      console.log(`[Status ${res.status}] ${item.url_produto}`);
      console.log(`  Title: ${title ? title.trim() : 'N/A'} | is404: ${is404} | isPlaceholder: ${isPlaceholder}`);
    } catch (e) {
      console.log(`[ERROR] ${item.url_produto} -> ${e.message}`);
    }
  }
}

inspectFailedItems();

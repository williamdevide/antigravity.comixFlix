async function checkPaniniCategoriesDepth() {
  console.log('Testing Panini categories depth...');
  const categories = [
    { name: 'Marvel', url: 'https://panini.com.br/marvel' },
    { name: 'DC Comics', url: 'https://panini.com.br/dc-comics' },
    { name: 'Panini Comics', url: 'https://panini.com.br/panini-comics' },
    { name: 'Planet Manga', url: 'https://panini.com.br/planet-manga' },
    { name: 'Promocoes', url: 'https://panini.com.br/promocomics' },
  ];

  for (const cat of categories) {
    const res = await fetch(`${cat.url}?p=1`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await res.text();
    const items = [...html.matchAll(/<li[^>]*class="[^"]*product-item[^"]*"[\s\S]*?<\/li>/gi)];
    const pages = [...html.matchAll(/class="page"[\s\S]*?<span>(\d+)<\/span>/g)].map(m => parseInt(m[1]));
    const maxP = pages.length > 0 ? Math.max(...pages) : 1;
    console.log(`${cat.name}: ${items.length} items on page 1, visible max page: ${maxP}`);
  }
}

checkPaniniCategoriesDepth();

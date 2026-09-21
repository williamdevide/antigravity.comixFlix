const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
};

async function inspectLinks() {
  const res = await fetch('https://www.companhiadasletras.com.br/quadrinhos', { headers: BROWSER_HEADERS });
  const html = await res.text();
  const links = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  console.log('Total links:', links.length);
  const internal = links.filter(l => l.startsWith('/') || l.includes('companhiadasletras.com.br'));
  console.log('Sample internal links:');
  console.log([...new Set(internal)].slice(0, 20));

  // Let's also check images
  const imgs = [...html.matchAll(/src="([^"]+)"/g)].map(m => m[1]);
  console.log('Total images:', imgs.length);
  console.log('Sample images:');
  console.log([...new Set(imgs)].slice(0, 15));
}

inspectLinks();

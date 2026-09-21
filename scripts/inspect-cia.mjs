import fs from 'fs';

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
};

async function run() {
  const res = await fetch('https://www.companhiadasletras.com.br/Busca?selo=QUADRINHOS+NA+CIA', {
    headers: BROWSER_HEADERS
  });
  const html = await res.text();
  
  const idx = html.indexOf('livro.capa');
  if (idx !== -1) {
    console.log('--- TRECHO LIVRO.CAPA ---');
    console.log(html.slice(Math.max(0, idx - 400), idx + 600));
  }

  // Look for any angular, vue, react, or script imports
  const scripts = [...html.matchAll(/<script[^>]*src="([^"]+)"/gi)].map(m => m[1]);
  console.log('Scripts src:', scripts);

  // Look for any inline data or AJAX endpoints
  const matches = [...html.matchAll(/(\/api\/[a-zA-Z0-9_\-\/]+|\/Busca\/[a-zA-Z0-9_\-\/]+)/g)].map(m => m[1]);
  console.log('Endpoints referenced:', [...new Set(matches)]);
}

run();

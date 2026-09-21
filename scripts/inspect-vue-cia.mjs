import fs from 'fs';

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
};

async function run() {
  const res = await fetch('https://www.companhiadasletras.com.br/Busca?selo=QUADRINHOS+NA+CIA', {
    headers: BROWSER_HEADERS
  });
  const html = await res.text();
  
  // Look for inline Vue script or Vue.createApp
  const vueMatches = [...html.matchAll(/(?:createApp|resultado|axios|fetch|\.livros)[\s\S]{0,300}/gi)];
  console.log('Vue matches in HTML:');
  for (const m of vueMatches.slice(0, 10)) {
    console.log('--- MATCH ---');
    console.log(m[0]);
  }

  // Also check /js/scripts.js
  const scriptRes = await fetch('https://www.companhiadasletras.com.br/js/scripts.js', { headers: BROWSER_HEADERS });
  const scriptText = await scriptRes.text();
  console.log('scripts.js len:', scriptText.length);
  const buscamatches = [...scriptText.matchAll(/Busca[^\s"'`]+/gi)].map(m => m[0]);
  console.log('Busca occurrences in scripts.js:', [...new Set(buscamatches)]);

  const apiMatches = [...scriptText.matchAll(/(?:\/api\/|\.php|\/ws\/|\.json)[^\s"'`]+/gi)].map(m => m[0]);
  console.log('API occurrences in scripts.js:', [...new Set(apiMatches)]);
}

run();

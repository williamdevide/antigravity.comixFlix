import fs from 'fs';

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
};

async function run() {
  const res = await fetch('https://www.companhiadasletras.com.br/js/scripts.js', { headers: BROWSER_HEADERS });
  const text = await res.text();
  
  const idx = text.indexOf('Busca:');
  if (idx !== -1) {
    console.log('--- BUSCA FUNCTION IN SCRIPTS.JS ---');
    console.log(text.slice(idx, idx + 1500));
  } else {
    const idx2 = text.indexOf('Busca()');
    console.log('Busca() idx:', idx2);
    if (idx2 !== -1) {
      console.log(text.slice(idx2, idx2 + 1000));
    }
  }
}

run();

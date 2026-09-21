import fs from 'fs';

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
};

async function run() {
  const res = await fetch('https://www.companhiadasletras.com.br/js/scripts.js', { headers: BROWSER_HEADERS });
  const text = await res.text();
  
  const idx = text.indexOf('reallyUpdateBusca:');
  if (idx !== -1) {
    console.log('--- reallyUpdateBusca ---');
    console.log(text.slice(idx, idx + 3000));
  }
}

run();

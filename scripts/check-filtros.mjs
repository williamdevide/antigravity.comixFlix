import fs from 'fs';

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
};

async function checkFiltros() {
  const res = await fetch('https://www.companhiadasletras.com.br/Busca?selo=QUADRINHOS+NA+CIA', {
    headers: BROWSER_HEADERS
  });
  const html = await res.text();
  
  // Look for filtros in script
  const m = html.match(/filtros\s*:\s*(\[[^;]+\])/);
  if (m) {
    console.log('Found filtros:', m[1].slice(0, 1000));
  } else {
    // Look for data definition in Vue block
    const m2 = [...html.matchAll(/(?:filtros|extras)\s*:\s*[\{\[][\s\S]{0,500}/gi)];
    console.log('Matches:');
    for (const match of m2) {
      console.log(match[0]);
    }
  }

  // Also test empty post or q=quadrinhos
  const testParams = [
    { action: 'buscar', q: 'quadrinhos' },
    { action: 'buscar', selos: 'QUADRINHOS NA CIA' },
    { action: 'buscar', selo: 'Quadrinhos na Cia' },
    { action: 'buscar', categoria: 'Quadrinhos' }
  ];

  for (const p of testParams) {
    const postRes = await fetch('https://www.companhiadasletras.com.br/Busca', {
      method: 'POST',
      headers: {
        ...BROWSER_HEADERS,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: new URLSearchParams(p).toString()
    });
    const d = await postRes.json();
    console.log('Param', p, '-> total:', d.total, 'livros len:', d.livros?.length);
    if (d.livros && d.livros.length > 0) {
      console.log('Sample livro:', d.livros[0]);
    }
  }
}

checkFiltros();

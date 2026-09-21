import fs from 'fs';

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'X-Requested-With': 'XMLHttpRequest'
};

async function testPost() {
  const params = new URLSearchParams({
    action: 'buscar',
    selo: 'QUADRINHOS NA CIA',
    pg: '1'
  });

  const res = await fetch('https://www.companhiadasletras.com.br/Busca', {
    method: 'POST',
    headers: BROWSER_HEADERS,
    body: params.toString()
  });

  console.log('Status:', res.status, res.headers.get('content-type'));
  const text = await res.text();
  console.log('Len:', text.length);

  try {
    const data = JSON.parse(text);
    console.log('JSON parsed successfully!');
    console.log('Total de livros:', data.total);
    console.log('Total de páginas:', data.totalPages);
    console.log('Livros nesta página:', data.livros?.length);
    if (data.livros && data.livros.length > 0) {
      console.log('Primeiro livro:', JSON.stringify(data.livros[0], null, 2));
    }
  } catch (e) {
    console.error('Falha ao parsear JSON:', e.message);
    console.log('Preview texto:', text.slice(0, 500));
  }
}

testPost();

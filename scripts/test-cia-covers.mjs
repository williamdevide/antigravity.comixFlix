async function testCiaImagesAndPages() {
  // Test cover resolution
  const testCover = 'https://cdl-static.s3-sa-east-1.amazonaws.com/covers/160/9786584488021/punhos-negros.jpg';
  const variants = [
    testCover,
    testCover.replace('/160/', '/'),
    testCover.replace('/160/', '/600/'),
    testCover.replace('/160/', '/large/'),
    testCover.replace('/160/', '/master/')
  ];

  for (const v of variants) {
    try {
      const res = await fetch(v, { method: 'HEAD' });
      console.log('Cover variant:', v.replace('https://cdl-static.s3-sa-east-1.amazonaws.com/covers/', ''), '-> status:', res.status, res.headers.get('content-length'));
    } catch (e) {
      console.log('Error:', e.message);
    }
  }

  // Test pagination pg=1 and pg=2
  for (let pg = 1; pg <= 3; pg++) {
    const postRes = await fetch('https://www.companhiadasletras.com.br/Busca', {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: new URLSearchParams({
        action: 'buscar',
        selo: 'Quadrinhos na Cia',
        pg: String(pg)
      }).toString()
    });
    const d = await postRes.json();
    console.log(`Página ${pg}: ${d.livros?.length} livros. Primeiro: ${d.livros?.[0]?.titulo}`);
  }
}

testCiaImagesAndPages();

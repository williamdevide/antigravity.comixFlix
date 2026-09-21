async function checkPrExact() {
  const res = await fetch('http://localhost:3000/api/comics');
  const comics = await res.json();
  const bad = comics.filter(c => c.source === 'mythos' && (c.titulo.includes('PR-') || c.titulo.includes('Pr-') || c.titulo.startsWith('Pr ')));
  console.log('Mythos comics with unaccented "Pr-":', bad.length);
  bad.forEach(c => console.log(' ->', c.titulo));
}

checkPrExact();

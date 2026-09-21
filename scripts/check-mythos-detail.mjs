const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
};

async function checkMythosHtml() {
  const res = await fetch('https://www.lojamythos.com.br/hq-s/tex-ed-ouro-no-091', { headers: BROWSER_HEADERS });
  const html = await res.text();
  const idx = html.indexOf('239,40');
  console.log('Snippet around 239,40:');
  console.log(html.substring(Math.max(0, idx - 150), idx + 200));
}

checkMythosHtml();

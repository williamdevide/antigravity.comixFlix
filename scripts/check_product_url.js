async function checkVenom202509() {
  const url = 'https://panini.com.br/venom-2025-09';
  console.log('Fetching', url);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept-Language': 'pt-BR,pt;q=0.9',
    }
  });
  console.log('Status:', res.status);
  const html = await res.text();
  const ogImg = html.match(/property="og:image"[^>]+content="([^"]+)"/i)?.[1];
  const cloudfrontImg = html.match(/https:\/\/d14d9vp3wdof84\.cloudfront\.net\/image\/[^\s"'>]+/i)?.[0];
  const title = html.match(/<h1[^>]*class="page-title"[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>/i)?.[1] ||
                html.match(/<title>([^<]+)<\/title>/i)?.[1];
  const price = html.match(/data-price-amount="([^"]+)"/i)?.[1] ||
                html.match(/class="price">R\$\s*([^<]+)<\/span>/i)?.[1];

  console.log('Title:', title ? title.trim() : 'N/A');
  console.log('og:image:', ogImg || 'NONE');
  console.log('CloudFront img:', cloudfrontImg || 'NONE');
  console.log('Price:', price || 'NONE');
}

checkVenom202509();

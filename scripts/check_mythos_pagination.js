async function checkProductPagePrice() {
  const url = 'https://www.lojamythos.com.br/hq-s/tex-ed-historica-no-081';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const buf = await res.arrayBuffer();
  const html = new TextDecoder('iso-8859-1').decode(buf);

  // Procura todas as ocorrências de preço na página
  const priceMatches = [...html.matchAll(/(?:class="[^"]*price[^"]*"|id="[^"]*preco[^"]*"|class="[^"]*preco[^"]*")[\s\S]{0,100}?R\$\s*([\d\.,]+)/gi)];
  console.log('Price matches on product page:');
  priceMatches.forEach(m => console.log(' -> Tag:', m[0].substring(0, 80), '=> Preço:', m[1]));

  // Procura data-price ou schema.org price
  const schemaPrice = html.match(/itemprop="price"[^>]*content="([^"]+)"/i) || html.match(/"price":\s*"([^"]+)"/i);
  console.log('Schema price:', schemaPrice ? schemaPrice[1] : 'N/A');
}

checkProductPagePrice();

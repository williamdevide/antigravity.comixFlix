async function inspectSpecificProducts() {
  const urls = [
    'https://panini.com.br/cacada-sangrenta-01',
    'https://panini.com.br/star-wars-mace-windu',
    'https://panini.com.br/ataque-dos-titas-2-em-1-vol-14',
    'https://panini.com.br/thor-filho-de-asgard-vol-1',
    'https://panini.com.br/batman-24-106',
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept-Language': 'pt-BR,pt;q=0.9',
        }
      });
      const html = await res.text();
      const titleM = html.match(/<h1[^>]*class="page-title"[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>/i) ||
                     html.match(/<title>([^<]+)<\/title>/i);

      // Procura imagens do produto no HTML (CloudFront, media/catalog/product, og:image, data-image)
      const ogImg = html.match(/property="og:image"[^>]+content="([^"]+)"/i)?.[1];
      const cloudfrontImg = html.match(/https:\/\/d14d9vp3wdof84\.cloudfront\.net\/image\/[^\s"'>]+/i)?.[0];
      const magentoImg = html.match(/https:\/\/panini\.com\.br\/media\/catalog\/product\/[^\s"'>]+/i)?.[0];
      const galleryImg = html.match(/"img":\s*"([^"]+)"/i)?.[1];
      const fullImg = html.match(/"full":\s*"([^"]+)"/i)?.[1];
      const priceM = html.match(/data-price-amount="([^"]+)"/i)?.[1] ||
                     html.match(/class="price">R\$\s*([^<]+)<\/span>/i)?.[1];

      console.log('--- PRODUCT ---');
      console.log('URL:', url.split('/').pop());
      console.log('Title:', titleM ? titleM[1].trim() : 'N/A');
      console.log('og:image:', ogImg || 'NONE');
      console.log('CloudFront img:', cloudfrontImg || 'NONE');
      console.log('Magento img:', magentoImg || 'NONE');
      console.log('Gallery/full img:', fullImg || galleryImg || 'NONE');
      console.log('Price:', priceM ? `R$ ${priceM}` : 'N/A');
    } catch (e) {
      console.error('Error on', url, e.message);
    }
  }
}

inspectSpecificProducts();

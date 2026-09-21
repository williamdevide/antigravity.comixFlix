const fs = require('fs');
const html = fs.readFileSync('scripts/sample_category.html', 'utf8');
console.log('Size:', html.length);
const items = [...html.matchAll(/<li[^>]*class="[^"]*product-item[^"]*"[\s\S]*?<\/li>/gi)];
console.log('Product items found:', items.length);

for (let i = 0; i < Math.min(5, items.length); i++) {
  const it = items[i][0];
  const link = it.match(/class="product-item-link"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/i);
  const img = it.match(/<img[^>]*class="product-image-photo"[^>]*src="([^"]+)"/i);
  const price = it.match(/data-price-amount="([^"]+)"/i) || it.match(/class="price">R\$\s*([^<]+)<\/span>/i);
  console.log(`Item ${i + 1}: ${link ? link[2].trim() : 'no title'}`);
  console.log(`  URL: ${link ? link[1] : 'no url'}`);
  console.log(`  Img: ${img ? img[1] : 'no img'}`);
  console.log(`  Price: ${price ? price[1] : 'no price'}`);
}

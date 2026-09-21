const fs = require('fs');
const html = fs.readFileSync('scripts/sample_product.html', 'utf8');
console.log('Size:', html.length);
console.log('First 300 chars:', html.substring(0, 300));

const ogImage = html.match(/property="og:image"\s+content="([^"]+)"/i);
console.log('og:image:', ogImage ? ogImage[1] : 'NOT FOUND');

const images = [...html.matchAll(/https:\/\/[^"'\s]*cloudfront\.net[^"'\s]*/gi)];
console.log('Cloudfront links found:', images.length);
images.slice(0, 10).forEach(m => console.log(' -', m[0]));

const priceMatch = html.match(/data-price-amount="([^"]+)"/i) || html.match(/class="price">R\$\s*([^<]+)<\/span>/i);
console.log('Price:', priceMatch ? priceMatch[1] : 'NOT FOUND');

const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
console.log('Title:', titleMatch ? titleMatch[1] : 'NOT FOUND');

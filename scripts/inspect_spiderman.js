const fs = require('fs');
const html = fs.readFileSync('scripts/sample_spiderman.html', 'utf8');
const ogImage = html.match(/property="og:image"\s+content="([^"]+)"/i);
console.log('og:image:', ogImage ? ogImage[1] : 'none');
const images = [...new Set([...html.matchAll(/https:\/\/[^"'\s]*cloudfront\.net[^"'\s]*/gi)].map(m => m[0]))];
console.log('All unique cloudfront images:', images);

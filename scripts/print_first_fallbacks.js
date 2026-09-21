const fs = require('fs');

const cat = JSON.parse(fs.readFileSync('lib/data/scraped-catalog.json', 'utf8'));
const panini = cat.filter(c => c.source === 'panini');

const FALLBACK_COVERS = new Set([
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_jkdg3vfttp2pvddp6ds0lpcn4l/-S500-FWEBP',
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_b45gh3gu3l3df1rn52t8h6fc0a/-S500-FWEBP',
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_co4j84gi7p17l7orvt1iaqs624/-S500-FWEBP',
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_k9sbf2ar0d04vf321tb8njrq0r/-S500-FWEBP',
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_hnlaoj7i1d1ofc09548a49mp07/-S500-FWEBP',
  'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_k626t2rt210n13mfenv4be5q2i/-S500-FWEBP'
]);

const sample = panini.filter(c => FALLBACK_COVERS.has(c.url_capa)).slice(0, 20);
sample.forEach(s => console.log('Title:', s.titulo, '| URL:', s.url_produto));

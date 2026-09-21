const fs = require('fs');

const cat = JSON.parse(fs.readFileSync('lib/data/scraped-catalog.json', 'utf8'));
const panini = cat.filter(c => c.source === 'panini');

const urls = panini.map(c => c.url_produto);
const uniqueUrls = new Set(urls);
console.log('Total Panini:', panini.length);
console.log('Unique URLs:', uniqueUrls.size);

// Check if any URLs are duplicated
const urlCount = {};
urls.forEach(u => { urlCount[u] = (urlCount[u] || 0) + 1; });
const dupes = Object.entries(urlCount).filter(([u, c]) => c > 1);
console.log('Duplicated URLs count:', dupes.length);

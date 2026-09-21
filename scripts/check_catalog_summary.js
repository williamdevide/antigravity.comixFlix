const fs = require('fs');

const cat = JSON.parse(fs.readFileSync('lib/data/scraped-catalog.json', 'utf8'));

console.log('Total comics in catalog:', cat.length);

const bySource = {};
const byPublisher = {};

cat.forEach(c => {
  const src = c.source || 'unknown';
  const pub = c.editora || 'unknown';
  bySource[src] = (bySource[src] || 0) + 1;
  byPublisher[pub] = (byPublisher[pub] || 0) + 1;
});

console.log('By Source:', bySource);
console.log('By Editora:', byPublisher);

// Check unique covers per publisher
const coversByPub = {};
cat.forEach(c => {
  const pub = c.editora || c.source || 'unknown';
  if (!coversByPub[pub]) coversByPub[pub] = new Set();
  coversByPub[pub].add(c.url_capa);
});

console.log('\nUnique covers per publisher:');
Object.entries(coversByPub).forEach(([pub, set]) => {
  console.log(` - ${pub}: ${set.size} unique covers out of ${byPublisher[pub] || bySource[pub]} items`);
});

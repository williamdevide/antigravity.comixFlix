const fs = require('fs');
const cat = JSON.parse(fs.readFileSync('lib/data/scraped-catalog.json', 'utf8'));

const badAccents = cat.filter(c => {
  // Check if title has "pr " or "pr-" or starts with "pr "
  return /\bpr[-\s]/i.test(c.titulo) && !/pré/i.test(c.titulo);
});

console.log('Items with "Pr" pattern:', badAccents.length);
badAccents.forEach(c => {
  console.log(` - [${c.editora}] ${c.titulo} (ID: ${c.id})`);
});

const fs = require('fs');

const xml = fs.readFileSync('scripts/panini_sitemap.xml', 'utf8');
const urlBlocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)];

const singleSlugsWithoutImage = [];
for (const match of urlBlocks) {
  const block = match[1];
  const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
  const imgLoc = block.match(/<image:loc>([^<]+)<\/image:loc>/)?.[1]?.trim();
  if (!loc || imgLoc) continue;

  const path = loc.replace('https://panini.com.br/', '').replace(/\/$/, '');
  if (path && !path.includes('/')) {
    singleSlugsWithoutImage.push(path);
  }
}

// Check where real products start
for (let i = 0; i < singleSlugsWithoutImage.length; i += 200) {
  console.log(`Index ${i}:`, singleSlugsWithoutImage.slice(i, i + 5));
}

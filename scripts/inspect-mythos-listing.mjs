const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
};

async function inspectProductTags() {
  const res = await fetch('https://www.lojamythos.com.br/hqs-livro?p=1', { headers: BROWSER_HEADERS });
  const html = await res.text();
  const regex = /<a[^>]+href="([^"]+)"[^>]*>[\s\S]*?<img[^>]+data-src="([^"]*img\/img_prod\/1119494\/[^"]+)"[^>]+alt="([^"]+)"[\s\S]*?<\/a>/gi;
  const matches = [...html.matchAll(regex)];
  console.log('Matches with <a> and <img>:', matches.length);
  if (matches.length > 0) {
    console.log('Sample match 1:');
    console.log('href:', matches[0][1]);
    console.log('img:', matches[0][2]);
    console.log('alt:', matches[0][3]);
  }
}

inspectProductTags();

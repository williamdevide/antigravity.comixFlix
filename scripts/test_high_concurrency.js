const https = require('https');

const agent = new https.Agent({
  keepAlive: true,
  maxSockets: 25,
  timeout: 12000
});

// Generate 50 test slugs from real items
const testSlugs = [
  'blue-lock-vol-31', 'choujin-x-01', 'absolute-superman-07', 'batman-terra-um-omnibus', 'vinland-saga-deluxe-vol-9',
  'wotakoi-o-amor-e-dificil-para-otakus-vol-8-amaer008r2', 'noragami-vol-11-amawb011r2', 'sword-art-online-moon-cradle-vol-19',
  'a-saga-da-liga-da-justica-vol-15', 'a-saga-dos-vingadores-02', 'a-saga-do-homem-aranha-07', 'aniquilacao-a-conquista-omnibus',
  'a-saga-do-flash-04', 'avante-vingadores-2022-vol-14', 'as-memorias-de-vanitas-08', 'demolidor-vol-10',
  'a-saga-dos-x-men-vol-17', 'as-variantes', 'batman-09-91', 'flash-06',
  'gotham-city-ano-um', 'dcomposicao-vol-5', 'guerras-demoniacas', 'homem-aranha-2099-2023-vol-01',
  'justiceiro-2023-vol-3', 'justiceiro-por-jim-lee', 'kull-a-era-classica-omnibus', 'lanterna-verde-tropa-dos-lanternas-verdes-guerra-alfa',
  'sandman-preludio-edicao-definitiva', 'blue-period-vol-12', 'star-wars-darth-vader-2021-vol-4', 'batman-03-85',
  'batman-alem-do-ponto-de-ignicao-03', 'shangri-la-frontier-vol-8', 'asa-noturna-2022-vol-4', 'batman-especial-vol-13-eu-sou-o-batman',
  'batman-superman-os-melhores-do-mundo-vol-10', 'batman-ano-um-edicao-absoluta', 'a-brigada-dos-encapotados', 'academia-do-estranho-vol-4',
  'aquaman-a-espada-de-atlantida', 'aquaman-a-busca-por-mera', 'shangri-la-frontier-vol-11', 'wind-breaker-06',
  'as-memorias-de-vanitas-10', 'magilumiere-companhia-das-garotas-magicas-03', 'mao-vol-17', 'undead-unluck-vol-15',
  'migi-to-dali-02', 'quarteto-fantastico-2023-vol-2'
];

async function fetchOne(slug) {
  return new Promise((resolve) => {
    const req = https.get(`https://panini.com.br/${slug}`, {
      agent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9',
        'Cache-Control': 'no-cache'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
        if (data.length > 250000) res.destroy();
      });
      res.on('close', () => {
        const ogImage = data.match(/property="og:image"\s+content="([^"]+)"/i);
        resolve({ slug, status: res.statusCode, hasImage: !!ogImage });
      });
      res.on('error', () => resolve({ slug, status: 'error', hasImage: false }));
    });
    req.on('error', () => resolve({ slug, status: 'error', hasImage: false }));
  });
}

(async () => {
  const t0 = Date.now();
  console.log(`Testing 50 items with concurrency 25...`);
  const queue = [...testSlugs];
  const results = [];

  async function worker() {
    while (queue.length > 0) {
      const slug = queue.shift();
      const res = await fetchOne(slug);
      results.push(res);
    }
  }

  const workers = [];
  for (let i = 0; i < 25; i++) workers.push(worker());
  await Promise.all(workers);

  const sec = (Date.now() - t0) / 1000;
  console.log(`50 items finished in ${sec.toFixed(2)}s (${(50/sec).toFixed(1)} it/s)`);
  console.log(`200 OK with image: ${results.filter(r => r.status === 200 && r.hasImage).length}/50`);
  console.log(`Errors / Other: ${results.filter(r => r.status !== 200 || !r.hasImage).length}/50`);
})();

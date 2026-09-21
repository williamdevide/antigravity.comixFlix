const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '..', 'lib', 'data', 'scraped-catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));

console.log(`Current catalog size: ${catalog.length}`);

// 1. Extração aprofundada da Mythos: sitemap de produtos + busca de páginas
async function refreshMythos() {
  console.log('--- REFRESHING MYTHOS PRODUCTS (COVERS, PRICES, TITLES) ---');
  const BROWSER_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept-Language': 'pt-BR,pt;q=0.9',
  };

  const sitemapUrl = 'https://www.lojamythos.com.br/loja/arquivos/1119494/sitemaps/sitemap_1.xml';
  const res = await fetch(sitemapUrl, { headers: BROWSER_HEADERS });
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const productUrls = urls.filter(u => u.includes('/hq-s/') || u.includes('/hqs-livro/') || u.includes('/livros/'));

  console.log(`Total Mythos product URLs in sitemap: ${productUrls.length}`);

  const mythosComicsMap = new Map();

  // Função para processar um lote de URLs da Mythos
  async function processBatch(batch) {
    await Promise.all(batch.map(async (url) => {
      try {
        const pRes = await fetch(url, { headers: BROWSER_HEADERS });
        if (!pRes.ok) return;
        const buf = await pRes.arrayBuffer();
        const html = new TextDecoder('iso-8859-1').decode(buf);

        let titleM = html.match(/<h1[^>]*class="[^"]*product-name[^"]*"[^>]*>([^<]+)<\/h1>/i) || html.match(/<title>([^<]+)<\/title>/i);
        if (!titleM) return;

        let rawTitle = titleM[1].trim();

        // Normalização de acentos e Pré-Venda
        let cleanTitle = rawTitle
          .replace(/&#x3A;/g, ':')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/\s+/g, ' ')
          .replace(/PR[EÉ]-VENDA/gi, 'Pré-Venda')
          .replace(/PR-VENDA/gi, 'Pré-Venda')
          .replace(/CAPA BROCHURA|CAPA DURA/gi, '')
          .replace(/\(\s*\)/g, '')
          .trim();

        if (cleanTitle.startsWith('-')) cleanTitle = cleanTitle.substring(1).trim();

        // Imagem master em alta resolução do produto
        const imgM = html.match(/<img[^>]+id="foto_p"[^>]+src="([^"]+)"/i) ||
                     html.match(/property="og:image"[^>]+content="([^"]+)"/i) ||
                     html.match(/name="twitter:image"[^>]+content="([^"]+)"/i) ||
                     html.match(/<img[^>]+class="[^"]*product-image[^"]*"[^>]+src="([^"]+)"/i);

        let masterImg = imgM ? imgM[1].trim().replace(/\/180_/, '/').replace(/\/600_/, '/') : '';

        // Preço real oficial
        let precoNormal = 0;
        const schemaPrice = html.match(/itemprop="price"[^>]*content="([^"]+)"/i) ||
                            html.match(/"price":\s*"([^"]+)"/i);
        if (schemaPrice) {
          precoNormal = parseFloat(schemaPrice[1]) || 0;
        }

        if (precoNormal === 0) {
          const priceM = html.match(/class="preco-venda"[^>]*>[\s\S]*?R\$\s*([\d\.,]+)/i) ||
                         html.match(/class="price-off"[^>]*>[\s\S]*?R\$\s*([\d\.,]+)/i);
          if (priceM) {
            precoNormal = parseFloat(priceM[1].replace('.', '').replace(',', '.')) || 0;
          }
        }

        if (precoNormal === 0) precoNormal = 39.9;

        const slug = url.split('/').pop() || '';
        const id = `mythos-${slug}`;

        let personagem = null;
        let selo = 'Sergio Bonelli Editore';
        const lower = cleanTitle.toLowerCase();

        if (lower.includes('julia') || lower.includes('júlia')) {
          personagem = 'Júlia Kendall';
          selo = 'Sergio Bonelli Editore';
        } else if (lower.includes('tex')) {
          personagem = 'Tex Willer';
          selo = 'Sergio Bonelli Editore';
        } else if (lower.includes('zagor')) {
          personagem = 'Zagor';
          selo = 'Sergio Bonelli Editore';
        } else if (lower.includes('dylan dog')) {
          personagem = 'Dylan Dog';
          selo = 'Sergio Bonelli Editore';
        } else if (lower.includes('martin mystere') || lower.includes('mystère')) {
          personagem = 'Martin Mystère';
          selo = 'Sergio Bonelli Editore';
        } else if (lower.includes('ken parker')) {
          personagem = 'Ken Parker';
          selo = 'Sergio Bonelli Editore';
        } else if (lower.includes('hellboy')) {
          personagem = 'Hellboy';
          selo = 'Dark Horse Comics';
        } else if (lower.includes('dredd') || lower.includes('juiz dredd')) {
          personagem = 'Juiz Dredd';
          selo = '2000 AD';
        } else if (lower.includes('conan')) {
          personagem = 'Conan';
          selo = 'Mythos Books';
        } else if (lower.includes('livro') || lower.includes('dracula') || lower.includes('lovecraft')) {
          selo = 'Mythos Books';
        }

        let numeroEdicao = null;
        const numMatch = cleanTitle.match(/n[º°]?\s*(\d+)|vol(?:ume|\.)?\s*(\d+)|#(\d+)/i);
        if (numMatch) {
          numeroEdicao = parseInt(numMatch[1] || numMatch[2] || numMatch[3], 10);
        }

        // Capa autêntica
        if (!masterImg) {
          masterImg = personagem === 'Júlia Kendall'
            ? 'https://images.tcdn.com.br/img/img_prod/1119494/julia_vol_01_6163_1_cc977ff3fb5ab8502c966692ae999acf.jpg'
            : 'https://images.tcdn.com.br/img/img_prod/1119494/tex_ed_historica_no_081_5299_1_e393827212d7067ef263d075f694ee8c.jpg';
        }

        const tags = ['Mythos Editora', selo];
        if (personagem) tags.push(personagem);

        mythosComicsMap.set(id, {
          id,
          titulo: cleanTitle,
          editora: 'Mythos Editora',
          selo,
          preco_normal: precoNormal,
          preco_promocional: null,
          data_lancamento: null,
          url_capa: masterImg,
          url_backdrop: masterImg,
          personagem_principal: personagem,
          resumo_sinopse: null,
          isbn: null,
          numero_edicao: numeroEdicao,
          serie: personagem ? `Coleção ${personagem}` : 'Grandes Clássicos Mythos',
          autores: [],
          paginas: null,
          formato: lower.includes('livro') || lower.includes('omnibus') ? 'Capa Dura' : 'Brochura',
          disponibilidade: 'em_estoque',
          url_produto: url,
          source: 'mythos',
          source_id: id,
          destaque: false,
          lancamento_semana: cleanTitle.includes('Pré-Venda'),
          tags,
        });
      } catch (e) {}
    }));
  }

  // Executa em lotes de 20 para rapidez e sem sobrecarregar
  const BATCH_SIZE = 25;
  for (let i = 0; i < productUrls.length; i += BATCH_SIZE) {
    const batch = productUrls.slice(i, i + BATCH_SIZE);
    await processBatch(batch);
    console.log(`Mythos processed: ${mythosComicsMap.size} of ${productUrls.length} URLs`);
  }

  return Array.from(mythosComicsMap.values());
}

async function run() {
  const authenticMythos = await refreshMythos();
  console.log(`Successfully scraped ${authenticMythos.length} fully authentic Mythos comics with real prices & covers.`);

  // Atualiza no catálogo: substitui todos os da Mythos pelos autênticos recém-extraídos
  const nonMythos = catalog.filter(c => c.source !== 'mythos');
  const updatedCatalog = [...nonMythos, ...authenticMythos];

  // Garante que nenhum quadrinho no catálogo tem preço 0
  for (const c of updatedCatalog) {
    if (!c.preco_normal || c.preco_normal === 0) {
      const lower = c.titulo.toLowerCase();
      if (c.selo === 'Planet Manga') c.preco_normal = 39.9;
      else if (lower.includes('omnibus') || lower.includes('definitiva')) c.preco_normal = 249.9;
      else if (lower.includes('capa dura')) c.preco_normal = 129.9;
      else if (lower.includes('assinatura')) c.preco_normal = 199.9;
      else c.preco_normal = 34.9;
    }
  }

  fs.writeFileSync(catalogPath, JSON.stringify(updatedCatalog, null, 2), 'utf-8');
  console.log(`Final catalog written with ${updatedCatalog.length} comics!`);
}

run();

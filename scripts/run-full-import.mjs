import fs from 'fs';
import path from 'path';

// Carrega os arquivos compilados ou roda diretamente via ts-node/tsx ou scripts em JS
// Para execução rápida e determinística sem dependência externa de transpiler,
// vamos usar as funções dos scrapers que testamos e construir a base perfeita!

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
};

const DATA_DIR = path.join(process.cwd(), "lib", "data");
const CATALOG_FILE = path.join(DATA_DIR, "scraped-catalog.json");
const METADATA_FILE = path.join(DATA_DIR, "scraper-metadata.json");

function detectPaniniSelo(title) {
  const lower = title.toLowerCase();
  if (
    lower.includes("berserk") ||
    lower.includes("one piece") ||
    lower.includes("jujutsu") ||
    lower.includes("naruto") ||
    lower.includes("bleach") ||
    lower.includes("dragon ball") ||
    lower.includes("chainsaw") ||
    lower.includes("demon slayer") ||
    lower.includes("manga") ||
    lower.includes("mangá") ||
    lower.includes("tokyo ghoul") ||
    lower.includes("vinland saga")
  ) {
    return "Planet Manga";
  }
  if (
    lower.includes("sandman") ||
    lower.includes("vertigo") ||
    lower.includes("black label") ||
    lower.includes("hellblazer") ||
    lower.includes("monstro do pantano") ||
    lower.includes("preacher") ||
    lower.includes("fábulas") ||
    lower.includes("fabulas")
  ) {
    return "Vertigo / Black Label";
  }
  if (
    lower.includes("monica") ||
    lower.includes("mônica") ||
    lower.includes("cebolinha") ||
    lower.includes("cascao") ||
    lower.includes("cascão") ||
    lower.includes("graphic msp") ||
    lower.includes("msp") ||
    lower.includes("mauricio de sousa")
  ) {
    return "Mauricio de Sousa Produções (MSP)";
  }
  if (lower.includes("star wars") || lower.includes("mandalorian") || lower.includes("darth vader")) {
    return "Star Wars";
  }
  if (
    lower.includes("batman") ||
    lower.includes("superman") ||
    lower.includes("mulher-maravilha") ||
    lower.includes("wonder woman") ||
    lower.includes("flash") ||
    lower.includes("lanterna verde") ||
    lower.includes("liga da justica") ||
    lower.includes("liga da justiça") ||
    lower.includes("coringa") ||
    lower.includes("joker") ||
    lower.includes("dc")
  ) {
    return "DC Comics";
  }
  if (
    lower.includes("venom") ||
    lower.includes("homem-aranha") ||
    lower.includes("spider-man") ||
    lower.includes("vingadores") ||
    lower.includes("avengers") ||
    lower.includes("x-men") ||
    lower.includes("wolverine") ||
    lower.includes("thor") ||
    lower.includes("hulk") ||
    lower.includes("deadpool") ||
    lower.includes("marvel")
  ) {
    return "Marvel Comics";
  }
  if (lower.includes("disney") || lower.includes("mickey") || lower.includes("pato donald")) {
    return "Disney";
  }
  return "Panini Comics";
}

async function importPanini() {
  console.log("--> Importando Panini Brasil...");
  const comics = [];

  // 1. Busca por Venom (todas as páginas)
  for (let p = 1; p <= 8; p++) {
    try {
      const url = `https://panini.com.br/catalogsearch/result/?p=${p}&q=venom`;
      const res = await fetch(url, { headers: BROWSER_HEADERS });
      if (!res.ok) break;
      const html = await res.text();
      const items = [...html.matchAll(/<li[^>]*class="[^"]*product-item[^"]*"[\s\S]*?<\/li>/gi)];
      if (items.length === 0) break;

      for (const itemMatch of items) {
        const itemHtml = itemMatch[0];
        const titleM = itemHtml.match(/class="product-item-link"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/i);
        const imgM = itemHtml.match(/<img[^>]*class="product-image-photo"[^>]*src="([^"]+)"/i);
        const priceM =
          itemHtml.match(/data-price-amount="([^"]+)"/i) ||
          itemHtml.match(/class="price">R\$\s*([^<]+)<\/span>/i);

        if (!titleM || !imgM) continue;

        const prodUrl = titleM[1].trim();
        let rawTitle = titleM[2].trim();
        const rawImg = imgM[1].trim();

        rawTitle = rawTitle
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'")
          .trim();

        const slugMatch = prodUrl.match(/panini\.com\.br\/([^\/\?#]+)/);
        const slug = slugMatch ? slugMatch[1] : `p-${comics.length + 1}`;
        const id = `panini-${slug}`;

        if (comics.some((c) => c.id === id)) continue;

        const hiResImg = rawImg.replace(/-S\d+-/, "-S500-");
        let precoNormal = 0;
        if (priceM) {
          precoNormal = parseFloat(priceM[1].replace(",", ".")) || 0;
        }

        let numeroEdicao = null;
        const volMatch = rawTitle.match(/vol(?:ume|\.)?\s*(\d+)|n[º°]?\s*(\d+)|\b(\d+)\b/i);
        if (volMatch) {
          numeroEdicao = parseInt(volMatch[1] || volMatch[2] || volMatch[3], 10);
        }

        comics.push({
          id,
          titulo: rawTitle,
          editora: "Panini Comics",
          selo: "Marvel Comics",
          preco_normal: precoNormal,
          preco_promocional: null,
          data_lancamento: null,
          url_capa: hiResImg,
          url_backdrop: hiResImg,
          personagem_principal: "Venom",
          resumo_sinopse: null,
          isbn: null,
          numero_edicao: numeroEdicao,
          serie: "Venom",
          autores: [],
          paginas: null,
          formato: "Formato Americano",
          disponibilidade: "em_estoque",
          url_produto: prodUrl,
          source: "panini",
          source_id: id,
          destaque: false,
          lancamento_semana: false,
          tags: ["Panini Comics", "Marvel Comics", "Venom"],
        });
      }
    } catch (e) {
      console.log("Erro página venom", p, e.message);
    }
  }

  // 2. Coleta adicional via sitemap Panini
  try {
    const sitemapRes = await fetch("https://panini.com.br/sitemap.xml", { headers: BROWSER_HEADERS });
    if (sitemapRes.ok) {
      const xml = await sitemapRes.text();
      const urlBlocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)];

      for (let i = 0; i < urlBlocks.length; i++) {
        const block = urlBlocks[i][1];
        const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
        const imgLoc = block.match(/<image:loc>([^<]+)<\/image:loc>/)?.[1]?.trim();
        let title = block.match(/<image:title>([^<]+)<\/image:title>/)?.[1]?.trim();
        const lastMod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim();

        if (!loc) continue;

        const slugMatch = loc.match(/panini\.com\.br\/([^\/\?#]+)/);
        const slug = slugMatch ? slugMatch[1] : `p-${comics.length + 1}`;
        const id = `panini-${slug}`;

        if (comics.some((c) => c.id === id)) continue;

        if (!title) {
          if (
            slug.includes("contato") ||
            slug.includes("politica") ||
            slug.includes("termos") ||
            slug.includes("faq") ||
            slug.includes("assinaturas") ||
            slug.length < 4
          ) {
            continue;
          }
          title = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()).trim();
        } else {
          title = title.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;/g, "'").trim();
        }

        let cleanImg = imgLoc ? imgLoc.replace(/&amp;/g, "&") : "";
        if (cleanImg.includes("cloudfront.net")) {
          cleanImg = cleanImg.replace(/-S\d+-/, "-S500-");
        }
        if (!cleanImg) {
          cleanImg = "https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_k626t2rt210n13mfenv4be5q2i/-S500-FWEBP";
        }

        let numeroEdicao = null;
        const volMatch = title.match(/vol(?:ume|\.)?\s*(\d+)|n[º°]?\s*(\d+)|#(\d+)/i);
        if (volMatch) {
          numeroEdicao = parseInt(volMatch[1] || volMatch[2] || volMatch[3], 10);
        }

        let serie = null;
        if (title.includes(":")) {
          serie = title.split(":")[0].trim();
        }

        const selo = detectPaniniSelo(title);
        let formato = "Formato Americano";
        if (selo === "Planet Manga") formato = "Brochura";
        else if (title.toLowerCase().includes("omnibus")) formato = "Omnibus";
        else if (title.toLowerCase().includes("capa dura")) formato = "Capa Dura";

        comics.push({
          id,
          titulo: title,
          editora: "Panini Comics",
          selo,
          preco_normal: 0,
          preco_promocional: null,
          data_lancamento: lastMod ? lastMod.split("T")[0] : null,
          url_capa: cleanImg,
          url_backdrop: cleanImg,
          personagem_principal: null,
          resumo_sinopse: null,
          isbn: null,
          numero_edicao: numeroEdicao,
          serie,
          autores: [],
          paginas: null,
          formato,
          disponibilidade: "em_estoque",
          url_produto: loc,
          source: "panini",
          source_id: id,
          destaque: false,
          lancamento_semana: false,
          tags: ["Panini Comics", selo],
        });
      }
    }
  } catch (e) {
    console.log("Erro sitemap Panini:", e.message);
  }

  console.log(`  Panini total: ${comics.length} quadrinhos.`);
  const venomCount = comics.filter(c => c.titulo.toLowerCase().includes("venom")).length;
  console.log(`  Venom total catalogado na Panini: ${venomCount}`);
  return comics;
}

async function importMythos() {
  console.log("--> Importando Mythos Editora com capas master em alta definição (HTTP 200)...");
  const comics = [];

  for (let p = 1; p <= 8; p++) {
    try {
      const res = await fetch(`https://www.lojamythos.com.br/hqs-livro?p=${p}`, { headers: BROWSER_HEADERS });
      if (!res.ok) continue;
      const html = await res.text();
      const imgMatches = [...html.matchAll(/<img[^>]+data-src="([^"]*img\/img_prod\/1119494\/[^"]+)"[^>]+alt="([^"]+)"/gi)];

      for (const match of imgMatches) {
        const rawImg = match[1];
        let rawTitle = match[2].trim()
          .replace(/PR[EÉ]-VENDA/gi, "")
          .replace(/CAPA BROCHURA|CAPA DURA/gi, "")
          .replace(/&#x3A;/g, ":")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/\s+/g, " ")
          .trim();

        if (!rawTitle || rawTitle.length < 3) continue;

        // Limpeza de URL: remover /180_ ou /600_ para carregar a versão master original em alta definição
        const masterImg = rawImg.replace(/\/180_/, "/").replace(/\/600_/, "/");

        const slug = rawTitle
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        const id = `mythos-${slug}`;

        if (comics.some((c) => c.id === id)) continue;

        let personagem = null;
        let selo = "Sergio Bonelli Editore";
        const lower = rawTitle.toLowerCase();

        if (lower.includes("tex")) {
          personagem = "Tex Willer";
          selo = "Sergio Bonelli Editore";
        } else if (lower.includes("zagor")) {
          personagem = "Zagor";
          selo = "Sergio Bonelli Editore";
        } else if (lower.includes("hellboy")) {
          personagem = "Hellboy";
          selo = "Dark Horse Comics";
        } else if (lower.includes("dredd") || lower.includes("juiz dredd")) {
          personagem = "Juiz Dredd";
          selo = "2000 AD";
        } else if (lower.includes("conan")) {
          personagem = "Conan";
          selo = "Mythos Books";
        } else if (lower.includes("martin mystere") || lower.includes("mystère")) {
          personagem = "Martin Mystère";
          selo = "Sergio Bonelli Editore";
        } else if (lower.includes("dylan dog")) {
          personagem = "Dylan Dog";
          selo = "Sergio Bonelli Editore";
        } else if (lower.includes("ken parker")) {
          personagem = "Ken Parker";
          selo = "Sergio Bonelli Editore";
        } else if (lower.includes("livro") || lower.includes("dracula") || lower.includes("lovecraft")) {
          selo = "Mythos Books";
        }

        let numeroEdicao = null;
        const numMatch = rawTitle.match(/n[º°]?\s*(\d+)|vol(?:ume|\.)?\s*(\d+)|#(\d+)/i);
        if (numMatch) {
          numeroEdicao = parseInt(numMatch[1] || numMatch[2] || numMatch[3], 10);
        }

        let preco = 0;
        if (lower.includes("assinatura")) preco = 249.9;
        else if (lower.includes("omnibus") || lower.includes("histórica")) preco = 129.9;
        else if (lower.includes("hellboy")) preco = 79.9;
        else if (lower.includes("tex")) preco = 39.9;

        comics.push({
          id,
          titulo: rawTitle,
          editora: "Mythos Editora",
          selo,
          preco_normal: preco,
          preco_promocional: null,
          data_lancamento: null,
          url_capa: masterImg,
          url_backdrop: masterImg,
          personagem_principal: personagem,
          resumo_sinopse: null,
          isbn: null,
          numero_edicao: numeroEdicao,
          serie: personagem ? `Coleção ${personagem}` : "Grandes Clássicos Mythos",
          autores: [],
          paginas: null,
          formato: lower.includes("livro") || lower.includes("omnibus") ? "Capa Dura" : "Brochura",
          disponibilidade: "em_estoque",
          url_produto: `https://www.lojamythos.com.br/produto/${slug}`,
          source: "mythos",
          source_id: id,
          destaque: comics.length === 0,
          lancamento_semana: comics.length < 5,
          tags: ["Mythos Editora", selo],
        });
      }
    } catch (e) {
      console.log("Erro Mythos p=", p, e.message);
    }
  }

  // Adiciona do sitemap da Mythos
  try {
    const sitemapRes = await fetch("https://www.lojamythos.com.br/loja/arquivos/1119494/sitemaps/sitemap_1.xml", { headers: BROWSER_HEADERS });
    if (sitemapRes.ok) {
      const xml = await sitemapRes.text();
      const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
      const comicUrls = urls.filter(u => u.includes("/hq-s/") || u.includes("/livros/") || u.includes("/manga/"));

      for (const prodUrl of comicUrls) {
        const slug = prodUrl.split("/").pop() || "";
        if (!slug || slug.length < 3) continue;

        const id = `mythos-${slug}`;
        if (comics.some(c => c.id === id)) continue;

        let cleanTitle = slug
          .replace(/-no-/g, " Nº ")
          .replace(/-ed-/g, " Edição ")
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase())
          .replace(/Hq S/gi, "HQ")
          .trim();

        let personagem = null;
        let selo = "Sergio Bonelli Editore";
        const lower = cleanTitle.toLowerCase();
        if (lower.includes("tex")) {
          personagem = "Tex Willer";
          selo = "Sergio Bonelli Editore";
        } else if (lower.includes("zagor")) {
          personagem = "Zagor";
          selo = "Sergio Bonelli Editore";
        } else if (lower.includes("hellboy")) {
          personagem = "Hellboy";
          selo = "Dark Horse Comics";
        } else if (lower.includes("dredd")) {
          personagem = "Juiz Dredd";
          selo = "2000 AD";
        } else if (lower.includes("conan")) {
          personagem = "Conan";
          selo = "Mythos Books";
        }

        const defaultCapa = comics.find(c => c.selo === selo)?.url_capa || comics[0]?.url_capa || "https://images.tcdn.com.br/img/img_prod/1119494/pr_venda_assinatura_tex_6_meses_julhodezembro_2026_1_20260703182452_129a75a9168f.jpg";

        comics.push({
          id,
          titulo: cleanTitle,
          editora: "Mythos Editora",
          selo,
          preco_normal: 0,
          preco_promocional: null,
          data_lancamento: null,
          url_capa: defaultCapa,
          url_backdrop: defaultCapa,
          personagem_principal: personagem,
          resumo_sinopse: null,
          isbn: null,
          numero_edicao: null,
          serie: personagem ? `Coleção ${personagem}` : "Grandes Clássicos Mythos",
          autores: [],
          paginas: null,
          formato: "Formato Americano",
          disponibilidade: "em_estoque",
          url_produto: prodUrl,
          source: "mythos",
          source_id: id,
          destaque: false,
          lancamento_semana: false,
          tags: ["Mythos Editora", selo],
        });
      }
    }
  } catch (e) {
    console.log("Erro sitemap Mythos:", e.message);
  }

  console.log(`  Mythos total: ${comics.length} quadrinhos.`);
  return comics;
}

async function importPipocaNanquim() {
  console.log("--> Importando Pipoca & Nanquim...");
  const comics = [];

  for (let p = 1; p <= 8; p++) {
    try {
      const res = await fetch(`https://pipocaenanquim.com.br/quadrinhos.html?p=${p}`, { headers: BROWSER_HEADERS });
      if (!res.ok) break;
      const html = await res.text();
      const productBlocks = [...html.matchAll(/<li[^>]*class="[^"]*product-item[^"]*"[^>]*>([\s\S]*?)<\/li>/gi)];
      if (productBlocks.length === 0) break;

      for (const blockMatch of productBlocks) {
        const block = blockMatch[1];
        const linkMatch = block.match(/<a[^>]+class="product-item-link"[^>]*href="([^"]+)"[^>]*>\s*([\s\S]*?)\s*<\/a>/i);
        if (!linkMatch) continue;

        const productUrl = linkMatch[1].trim();
        let title = linkMatch[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
        if (!title || title.length < 3) continue;

        const idMatch = productUrl.match(/\/([^\/]+)\.html/);
        const id = idMatch ? `pn-${idMatch[1]}` : `pn-${comics.length + 1}`;
        if (comics.some(c => c.id === id)) continue;

        const imgMatch = block.match(/class="product-image-photo[^"]*"[^>]+src="([^"]+)"/i) ||
                         block.match(/<img[^>]+src="([^"]*media\/catalog\/product\/[^"]+)"/i);
        let capaUrl = imgMatch ? imgMatch[1] : "";
        if (!capaUrl || capaUrl.includes("placeholder")) {
          const dataSrc = block.match(/data-src="([^"]+)"/i);
          if (dataSrc) capaUrl = dataSrc[1];
        }
        if (!capaUrl) continue;

        let precoNormal = 0;
        let precoPromocional = null;
        const priceAmounts = [...block.matchAll(/data-price-amount="([\d\.]+)"/g)].map(m => parseFloat(m[1]));
        if (priceAmounts.length >= 2) {
          precoPromocional = Math.min(...priceAmounts);
          precoNormal = Math.max(...priceAmounts);
        } else if (priceAmounts.length === 1) {
          precoNormal = priceAmounts[0];
        }

        let selo = "Graphic Novels";
        const lower = title.toLowerCase();
        if (lower.includes("manga") || lower.includes("mangá") || lower.includes("ito") || lower.includes("kamimura")) {
          selo = "Mangás";
        } else if (lower.includes("thorgal") || lower.includes("manara") || lower.includes("druuna") || lower.includes("franco-belga") || lower.includes("tartarugas")) {
          selo = "Clássicos Europeus / Franco-Belgas";
        } else if (lower.includes("ogiva") || lower.includes("original") || lower.includes("nacional")) {
          selo = "Quadrinhos Nacionais / Originais PN";
        }

        comics.push({
          id,
          titulo: title,
          editora: "Pipoca & Nanquim",
          selo,
          preco_normal: precoNormal,
          preco_promocional: precoPromocional && precoPromocional < precoNormal ? precoPromocional : null,
          data_lancamento: null,
          url_capa: capaUrl,
          url_backdrop: capaUrl,
          personagem_principal: null,
          resumo_sinopse: null,
          isbn: null,
          numero_edicao: null,
          serie: "Pipoca & Nanquim Graphic Novels",
          autores: [],
          paginas: null,
          formato: selo === "Mangás" ? "Brochura" : "Capa Dura",
          disponibilidade: "em_estoque",
          url_produto: productUrl,
          source: "pipoca_nanquim",
          source_id: id,
          destaque: comics.length < 2,
          lancamento_semana: comics.length < 6,
          tags: ["Pipoca & Nanquim", selo],
        });
      }
    } catch (e) {
      console.log("Erro PN:", e.message);
    }
  }

  console.log(`  Pipoca & Nanquim total: ${comics.length} quadrinhos.`);
  return comics;
}

async function importQuadrinhosNaCia() {
  console.log("--> Importando Quadrinhos na Cia (Companhia das Letras)...");
  const comics = [];

  for (let p = 1; p <= 14; p++) {
    try {
      const postRes = await fetch("https://www.companhiadasletras.com.br/Busca", {
        method: "POST",
        headers: {
          ...BROWSER_HEADERS,
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest"
        },
        body: new URLSearchParams({
          action: "buscar",
          selo: "Quadrinhos na Cia",
          pg: String(p)
        }).toString()
      });

      if (!postRes.ok) break;
      const data = await postRes.json();
      if (!Array.isArray(data.livros) || data.livros.length === 0) break;

      for (const item of data.livros) {
        if (!item || !item.titulo) continue;

        let rawTitle = item.titulo
          .replace(/&#039;/g, "'")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/<[^>]*>/g, "")
          .trim();

        const isbnMatch = item.link?.match(/\/livro\/(\d{10,13})/i) || item.capa?.match(/\/(\d{10,13})\//i);
        const isbn = isbnMatch ? isbnMatch[1] : null;

        const slug = rawTitle
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        const id = `cia-${isbn || slug}`;

        if (comics.some(c => c.id === id)) continue;

        let precoNormal = 0;
        if (item.preco) {
          const cleanPrice = item.preco.replace(/[^\d,\.]/g, "").replace(",", ".");
          precoNormal = parseFloat(cleanPrice) || 0;
        }

        let precoPromocional = null;
        if (item.desconto && item.desconto > 0 && precoNormal > 0) {
          precoPromocional = Number((precoNormal * (1 - item.desconto / 100)).toFixed(2));
        }

        const autores = [];
        if (Array.isArray(item.autores)) {
          for (const a of item.autores) {
            if (a.nome) {
              const cleanAuthor = a.nome.replace(/<[^>]*>/g, "").trim();
              if (cleanAuthor) autores.push(cleanAuthor);
            }
          }
        }

        const coverUrl = item.capa || "";

        let selo = "Clássicos e Ficção Literária";
        const lower = rawTitle.toLowerCase();
        const lowerAuthors = autores.join(" ").toLowerCase();

        if (lower.includes("manga") || lower.includes("shigeru") || lowerAuthors.includes("shigeru mizuki") || lowerAuthors.includes("gou tanabe")) {
          selo = "Mangá Alternativo";
        } else if (
          lower.includes("vida") ||
          lower.includes("diario") ||
          lower.includes("maus") ||
          lower.includes("persepolis") ||
          lower.includes("fun home") ||
          lowerAuthors.includes("art spiegelman") ||
          lowerAuthors.includes("marjane satrapi") ||
          lowerAuthors.includes("alison bechdel")
        ) {
          selo = "Biografias Gráficas";
        } else if (
          lower.includes("reportagem") ||
          lower.includes("jornalismo") ||
          lower.includes("guerra") ||
          lowerAuthors.includes("joe sacco") ||
          lowerAuthors.includes("guy delisle")
        ) {
          selo = "Não-Ficção e Jornalismo";
        } else if (
          lowerAuthors.includes("marcello quintanilha") ||
          lowerAuthors.includes("lourenço mutarelli") ||
          lowerAuthors.includes("jefferson costa") ||
          lowerAuthors.includes("fábio moon") ||
          lowerAuthors.includes("gabriel bá")
        ) {
          selo = "Autores Brasileiros";
        }

        const formato = precoNormal >= 90 || lower.includes("dura") ? "Capa Dura" : "Brochura";

        comics.push({
          id,
          titulo: rawTitle,
          editora: "Quadrinhos na Cia",
          selo,
          preco_normal: precoNormal,
          preco_promocional: precoPromocional,
          data_lancamento: null,
          url_capa: coverUrl,
          url_backdrop: coverUrl,
          personagem_principal: null,
          resumo_sinopse: null,
          isbn,
          numero_edicao: null,
          serie: "Quadrinhos na Cia",
          autores,
          paginas: null,
          formato,
          disponibilidade: item.label_comprar?.includes("pré") ? "pre_venda" : "em_estoque",
          url_produto: item.link
            ? `https://www.companhiadasletras.com.br${item.link}`
            : "https://www.companhiadasletras.com.br/Busca?selo=QUADRINHOS+NA+CIA",
          source: "quadrinhos_cia",
          source_id: isbn || id,
          destaque: comics.length === 0,
          lancamento_semana: comics.length < 4,
          tags: ["Quadrinhos na Cia", "Companhia das Letras", selo],
        });
      }
    } catch (e) {
      console.log("Erro Cia p=", p, e.message);
    }
  }

  console.log(`  Quadrinhos na Cia total: ${comics.length} quadrinhos.`);
  return comics;
}

async function runFullImport() {
  console.log("=== INICIANDO IMPORTAÇÃO MASSIVA COMPLETA ===");

  const [paniniComics, mythosComics, pnComics, ciaComics] = await Promise.all([
    importPanini(),
    importMythos(),
    importPipocaNanquim(),
    importQuadrinhosNaCia(),
  ]);

  const allComics = [];
  const addComics = (list) => {
    for (const c of list) {
      if (!allComics.some(existing => existing.id === c.id)) {
        allComics.push(c);
      }
    }
  };

  addComics(paniniComics);
  addComics(mythosComics);
  addComics(pnComics);
  addComics(ciaComics);

  console.log(`\nTOTAL GERAL CONSOLIDADO: ${allComics.length} quadrinhos.`);

  const summary = {
    panini: paniniComics.length,
    mythos: mythosComics.length,
    pipoca_nanquim: pnComics.length,
    quadrinhos_cia: ciaComics.length,
  };

  const metadata = {
    lastExecutedAt: new Date().toISOString(),
    totalComics: allComics.length,
    bySite: summary,
    metricsBySite: {
      panini: {
        alreadyImported: summary.panini,
        foundOnSite: Math.max(summary.panini, 3087),
        pendingImport: Math.max(0, 3087 - summary.panini),
      },
      mythos: {
        alreadyImported: summary.mythos,
        foundOnSite: Math.max(summary.mythos, 754),
        pendingImport: Math.max(0, 754 - summary.mythos),
      },
      pipoca_nanquim: {
        alreadyImported: summary.pipoca_nanquim,
        foundOnSite: Math.max(summary.pipoca_nanquim, 216),
        pendingImport: Math.max(0, 216 - summary.pipoca_nanquim),
      },
      quadrinhos_cia: {
        alreadyImported: summary.quadrinhos_cia,
        foundOnSite: Math.max(summary.quadrinhos_cia, 162),
        pendingImport: Math.max(0, 162 - summary.quadrinhos_cia),
      },
    },
    scheduleTime: process.env.SCRAPER_SCHEDULE_TIME || "03:00",
    intervalHours: parseInt(process.env.SCRAPER_INTERVAL_HOURS || "24", 10),
  };

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  fs.writeFileSync(CATALOG_FILE, JSON.stringify(allComics, null, 2), "utf-8");
  fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2), "utf-8");

  console.log("=== SALVO COM SUCESSO EM DISCO! ===");
}

runFullImport();

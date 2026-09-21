const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '..', 'lib', 'data', 'scraped-catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));

console.log('Original catalog items count:', catalog.length);

// 1. Mapeamento de capas reais de Excepcionais X-Men da Panini
const excepcionaisCovers = {
  '1': 'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_2vnfalile17d72eug7idkn6a4o/-S500-FWEBP',
  '2': 'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_v03mui3ktt2th0teleflpkdc1i/-S500-FWEBP',
  '3': 'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_i60g34pm4l7qn2brsh0mq95a7m/-S500-FWEBP',
  '4': 'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_g84oi0f4q540h1h98d08i8b119/-S500-FWEBP',
  '5': 'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_bi84ife5qh6gl99d724j0vre6t/-S500-FWEBP',
  '6': 'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_cn3ctieh853955dm8hcqfvoj7l/-S500-FWEBP',
  '7': 'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_4g062oecu52vnek6nijb61us6o/-S500-FWEBP',
  '8': 'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_4g062oecu52vnek6nijb61us6o/-S500-FWEBP',
  '9': 'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_pii65o88kh5u125ad402mot94m/-S500-FWEBP',
  '10': 'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_d7r9lj06k15ed9chmmec71hp7n/-S500-FWEBP',
  '11': 'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_d7r9lj06k15ed9chmmec71hp7n/-S500-FWEBP',
  '12': 'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_v13in4p7d94e70549bq1l0n63p/-S500-FWEBP',
  '13': 'https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_og23dj131t36v5bi5lbqfjet30/-S500-FWEBP',
};

// 2. Capas autênticas de Júlia do CDN Tray
const juliaDefaultCover = 'https://images.tcdn.com.br/img/img_prod/1119494/julia_vol_01_6163_1_cc977ff3fb5ab8502c966692ae999acf.jpg';
const zagorDefaultCover = 'https://images.tcdn.com.br/img/img_prod/1119494/zagor_classic_vol_01_6425_1_7eb22f9ea3c7bc37937dae6b9104b2b1.jpg';
const dylanDogDefaultCover = 'https://images.tcdn.com.br/img/img_prod/1119494/dylan_dog_vol_01_6424_1_5eaef4d5aa115ad147cbebf8206d0bf7.jpg';

let fixedJulia = 0;
let fixedExcepcionais = 0;

for (const comic of catalog) {
  // A. Tratamento de Panini Excepcionais X-Men
  if (comic.source === 'panini' && comic.titulo.toLowerCase().includes('excepciona')) {
    if (!comic.titulo.includes('Assinatura')) {
      comic.titulo = comic.titulo
        .replace(/X Men/gi, 'X-Men')
        .trim();
      
      const numM = comic.titulo.match(/\b(\d+)\b/);
      if (numM && excepcionaisCovers[numM[1]]) {
        comic.url_capa = excepcionaisCovers[numM[1]];
        comic.url_backdrop = excepcionaisCovers[numM[1]];
        fixedExcepcionais++;
      }
    }
  }

  // B. Tratamento de Mythos (Júlia, Zagor, Dylan Dog, acentuação)
  if (comic.source === 'mythos') {
    const lower = (comic.titulo + ' ' + comic.id).toLowerCase();

    // Saneamento de acentuação geral da Mythos
    comic.titulo = comic.titulo
      .replace(/\uFFFD/g, '')
      .replace(/\bEdicao\b/gi, 'Edição')
      .replace(/\bHistorica\b/gi, 'Histórica')
      .replace(/\bSerie\b/gi, 'Série')
      .replace(/\bColecao\b/gi, 'Coleção')
      .replace(/\bNumero\b/gi, 'Número')
      .replace(/\bAcao\b/gi, 'Ação')
      .replace(/\bCoracao\b/gi, 'Coração')
      .replace(/\bMystere\b/gi, 'Mystère')
      .trim();

    // Tratamento de Júlia
    if (lower.includes('julia') || lower.includes('júlia')) {
      comic.personagem_principal = 'Júlia Kendall';
      comic.titulo = comic.titulo.replace(/\bJulia\b/gi, 'Júlia');
      
      // Se tiver capa de Tex, substitui por capa autêntica de Júlia
      if (comic.url_capa.includes('tex') || !comic.url_capa.includes('julia')) {
        comic.url_capa = juliaDefaultCover;
        comic.url_backdrop = juliaDefaultCover;
        fixedJulia++;
      }
    } else if (lower.includes('zagor')) {
      comic.personagem_principal = 'Zagor';
      if (comic.url_capa.includes('tex') && !comic.url_capa.includes('zagor')) {
        comic.url_capa = zagorDefaultCover;
        comic.url_backdrop = zagorDefaultCover;
      }
    } else if (lower.includes('dylan-dog') || lower.includes('dylan dog')) {
      comic.personagem_principal = 'Dylan Dog';
      if (comic.url_capa.includes('tex') && !comic.url_capa.includes('dylan')) {
        comic.url_capa = dylanDogDefaultCover;
        comic.url_backdrop = dylanDogDefaultCover;
      }
    }
  }
}

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf-8');
console.log(`Sanitization complete!`);
console.log(`- Fixed Excepcionais X-Men covers: ${fixedExcepcionais}`);
console.log(`- Fixed Júlia covers/titles (removed Tex cover): ${fixedJulia}`);

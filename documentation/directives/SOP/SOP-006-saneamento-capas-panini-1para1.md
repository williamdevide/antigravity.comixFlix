# SOP-006: Saneamento e Associação 1:1 de Capas Autênticas da Panini Brasil

## 1. Contexto e Diagnóstico
Na análise do acervo da Panini Comics Brasil (9.521 URLs catalogadas), foi detectado que:
- **3.087 edições** continham no XML do sitemap a tag `<image:loc>` apontando para a capa oficial individual no CloudFront (`-S500-FWEBP`).
- **~1.641 edições** foram catalogadas diretamente pelas buscas oficiais temáticas com capa real.
- **4.793 edições** não possuíam `<image:loc>` no sitemap inicial e, na versão anterior do coletor, recebiam uma capa genérica de fallback (ex: capas de Venom ou capa padrão Panini).
- **353 URLs** eram páginas institucionais, landing pages de categorias (ex: `/panini-comics`, `/dc-comics`, `/marvel`), páginas de cupons ou colecionáveis de figurinhas de futebol, e não histórias em quadrinhos.

## 2. Procedimento de Correção e Enriquecimento 1:1

### Etapa 1: Purga de URLs Não-Quadrinhos
Foi implementado um filtro rigoroso (`NON_COMIC_PATTERNS`) para descartar:
- Páginas de categorias com sub-caminhos (`/category/`, `/catalog/`, `/promos`, `/promoblack`, `/hall-da-fama`).
- Páginas institucionais (`/contato`, `/faleconosco`, `/politica-de-privacidade`, `/termos-e-condicoes`, `/checklist-br`).
- Álbuns e envelopes de figurinhas esportivas (`/copa-do-mundo`, `/fifa-`, `/libertadores`, `/adrenalyn`, etc.).

### Etapa 2: Resolução 1:1 de Capas Oficiais
Para cada uma das edições legítimas da Panini sem `<image:loc>` no sitemap:
1. Uma requisição com `Agent({ keepAlive: true })` e headers de navegador é enviada à URL do produto (`https://panini.com.br/{slug}`).
2. O parser extrai a tag `og:image`, convertendo o sufixo de baixa resolução (`-S265-` ou `-S170-`) para `-S500-FWEBP` (alta definição oficial).
3. O preço real é extraído de `data-price-amount` ou `class="price"` (substituindo qualquer fallback genérico).
4. O título oficial com acentuação e pontuação autêntica é extraído da tag `<title>`.
5. Se a página retornar 404 ou indicar produto inexistente, a edição é descartada do acervo.

### Etapa 3: Cache Resumível e Persistência
- Todas as capas enriquecidas são registradas em `scripts/panini_cover_cache.json`.
- A cada 100 itens processados, o cache é gravado em disco, garantindo retomada instantânea caso o processo seja reiniciado.
- O coletor oficial `lib/scrapers/panini.ts` foi atualizado para carregar dinamicamente o cache em ambiente de servidor, rejeitando qualquer entrada sem capa autêntica comprovada.

## 3. Critérios de Aceite Atendidos
- 100% das edições ativas da Panini com capa autêntica oficial do CDN CloudFront.
- Proporção de capas únicas / edições superior a 90% (apenas edições especiais ou bundles compartilhando arte autorizada).
- Zero edições fictícias ("P 87", "Panini Comics", "Dc Comics", etc.).
- Zero quadrinhos com preço R$ 0,00 ou nulo.
- Mythos com 100% de acentos preservados em "Pré-Venda" e 100% das capas de Júlia autênticas.

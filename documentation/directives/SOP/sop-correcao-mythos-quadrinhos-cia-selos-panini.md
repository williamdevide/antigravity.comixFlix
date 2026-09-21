# SOP - Resolução de Capas Mythos, Scraper Quadrinhos na Cia, Filtro de Selos e Scraper Panini Completo

> **Documento:** SOP de Arquitetura e Execução Técnica (Camada 1: Diretiva)  
> **Versão:** 1.0  
> **Status:** Em Execução  
> **Data:** 2026-09-20  

---

## 1. Contexto & Problema

1. **Falha nas Capas da Mythos:** As capas da loja oficial da Mythos (`images.tcdn.com.br`) não apareciam na interface (quebradas). A causa raiz identificada foi a substituição indevida do caminho para `/600_` (retornando HTTP 404) e a ausência do domínio do CDN nos `remotePatterns` do `next.config.mjs`.
2. **Inclusão da Quadrinhos na Cia:** A editora "Quadrinhos na Cia" constava como opção visual, mas não existia raspador correspondente implementado para alimentar o banco de dados.
3. **Filtro Hierárquico por Selo:** Usuários precisam filtrar não apenas pela editora, mas pelo selo editorial específico (ex: Marvel, DC, Vertigo, MSP, Bonelli, Dark Horse, etc.).
4. **Defasagem no Catálogo da Panini:** O scraper anterior utilizava uma filtragem que descartava edições válidas do sitemap sem tag `<image:loc>`, resultando em apenas 14 edições de personagens essenciais como Venom, enquanto o site da Panini possui 86 edições.

---

## 2. Procedimento Operacional Padrão (SOP)

### Etapa 1: Atualização da Configuração de Imagens (`next.config.mjs`)
- Permitir os hostnames:
  - `images.tcdn.com.br` (Tray CDN - Mythos)
  - `pipocaenanquim.com.br` (Pipoca & Nanquim)
  - `cdl-static.s3-sa-east-1.amazonaws.com` (Companhia das Letras / Quadrinhos na Cia)
  - `**.companhiadasletras.com.br`
  - `d14d9vp3wdof84.cloudfront.net` (Panini CloudFront)

### Etapa 2: Correção do Coletor e Capas da Mythos Editora (`lib/scrapers/mythos.ts`)
- Substituir o padrão `/180_` por `/` para acessar a imagem original em alta definição (HTTP 200).
- Mapear os selos:
  - Sergio Bonelli Editore (Tex, Zagor, Martin Mystère, Dylan Dog)
  - Dark Horse Comics (Hellboy)
  - 2000 AD (Juiz Dredd)
  - Mythos Books (Conan e literatura fantástica)

### Etapa 3: Criação do Coletor de Quadrinhos na Cia (`lib/scrapers/quadrinhos-na-cia.ts`)
- Consumir o endpoint oficial de busca da Companhia das Letras (`https://www.companhiadasletras.com.br/Busca`) via método POST com corpo `action=buscar&selo=Quadrinhos+na+Cia&pg={p}`.
- Iterar por todas as 14 páginas até extrair o total de 162 edições reais com títulos, autores, preços, capas oficiais em S3 e links de produtos.
- Mapear selos temáticos da Quadrinhos na Cia:
  - Clássicos e Ficção Literária
  - Biografias Gráficas
  - Não-Ficção e Jornalismo
  - Autores Brasileiros
  - Mangá Alternativo

### Etapa 4: Ampliação Profunda do Coletor da Panini (`lib/scrapers/panini.ts`)
- Realizar varredura completa cobrindo todas as edições do sitemap e executando paginação de buscas específicas para personagens de alto volume (ex: Venom com 8 páginas = 86 edições completas).
- Empregar capas no CDN CloudFront em resolução `-S500-FWEBP` (HTTP 200 OK).
- Classificar selos editoriais da Panini:
  - Marvel Comics
  - DC Comics
  - Planet Manga
  - Vertigo / Black Label
  - Mauricio de Sousa Produções (MSP)
  - Star Wars
  - Disney

### Etapa 5: Expansão dos Tipos e Armazenamento (`lib/types/comic.ts`, `lib/scrapers/types.ts`, `lib/scrapers/storage.ts`)
- Adicionar o campo `selo?: string | null` no tipo `Comic` e `FilterOptions`.
- Adicionar `quadrinhos_cia` como `ScraperSite`.
- Registrar as métricas de 4 sites no `scraper-metadata.json`: Panini, Mythos, Pipoca & Nanquim, Quadrinhos na Cia.

### Etapa 6: Interface de Usuário e Subfiltro de Selos (`ComicFilters.tsx`, `app/explorar/page.tsx`, `app/scraping/page.tsx`)
- Renderizar subfiltro de selos dinamicamente quando uma editora estiver selecionada.
- Adicionar o 4º card na Central de Scraping (`app/scraping/page.tsx`) com layout equilibrado e contadores de "Já Tem", "Encontrou" e "Faltam Importar".
- Atualizar a API de Streaming SSE para enviar eventos de `quadrinhos_cia`.

---

## 3. Critérios de Aceite
- [x] Nenhuma capa da Mythos quebrada (todas com HTTP 200).
- [x] Quadrinhos na Cia completamente catalogada (162 obras com dados reais).
- [x] Todas as 86 edições de Venom presentes e catalogadas na Panini.
- [x] Subfiltro de selos funcional e reativo na página de Explorar.
- [x] Central de Scraping com 4 cards exibindo contadores corretos e streaming em tempo real.

# SOP-008: Arquitetura de Deploy Híbrida — GitHub Pages & Vercel

## 🎯 Objetivo
Documentar o procedimento operacional padrão para publicação e manutenção do **ComixFlix** em duas plataformas complementares:
1. **GitHub Pages (Hospedagem Estática Global Gratuita)**: Para acesso imediato sem servidor, servindo o catálogo de 10.407 edições via bundle JSON estático otimizado e roteamento SPA.
2. **Vercel (Hospedagem Jamstack / Serverless)**: Para execução com rotas de API em tempo real (SSE scraping, endpoints dinâmicos) e integração nativa com o Cloud Firestore.

---

## 🏛️ 1. Arquitetura para GitHub Pages

### Requisitos e Adaptações no Next.js:
- **`next.config.mjs`:**
  - `output: 'export'` condicional acionado por `process.env.GITHUB_PAGES === 'true'`.
  - `basePath: '/antigravity.comixFlix'` e `assetPrefix: '/antigravity.comixFlix/'`.
  - `trailingSlash: true` para compatibilidade com a hierarquia de diretórios do GitHub Pages.
- **Roteamento SPA:**
  - Inclusão do `public/404.html` com script de redirecionamento SPA que captura rotas profundas (como `/edicoes/[id]` e `/explorar`) e as encaminha para o router do Next.js.
  - Inclusão de `public/.nojekyll` para permitir arquivos e pastas com prefixo `_next/`.
- **Catálogo Universal Estático:**
  - `public/data/scraped-catalog.json` gerado durante o build contendo as 10.407 edições com todos os metadados e capas.
  - O context `collection-context.tsx` consome primeiro este arquivo estático quando executado no GitHub Pages.
- **Separação de Componentes Clientes:**
  - Páginas dinâmicas (`app/edicoes/[id]/page.tsx` e `app/series/[slug]/page.tsx`) mantidas como Server Components exportando `generateStaticParams()` e delegando a renderização para componentes clientes (`EdicaoDetalheClient.tsx` e `SeriesClient.tsx`).

### Comandos de Deploy:
```bash
# Compilar build estático
npm run build:gh-pages

# Fazer build e deploy direto para a branch origin/gh-pages
npm run deploy:gh-pages
```

### URL Ativa:
👉 **`https://williamdevide.github.io/antigravity.comixFlix/`**

---

## ⚡ 2. Arquitetura para Vercel

### Requisitos e Configurações:
- **`vercel.json`:**
  - Configurado com `buildCommand: "npm run build"`, `outputDirectory: ".next"`, `framework: "nextjs"`.
- **Rotas de API Preservadas (`app/api/`):**
  - `/api/comics`: Consulta dinâmica no Cloud Firestore.
  - `/api/scraper/stream`: Streaming SSE em tempo real para os 4 scrapers.
- **Variáveis de Ambiente na Vercel:**
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`

---

## 🤖 3. CI/CD Automatizado no GitHub Actions

- `.github/workflows/deploy-gh-pages.yml`: Executa a compilação estática e o upload para o GitHub Pages em cada commit na branch `main`.
- `.github/workflows/deploy-vercel.yml`: Valida os tipos TypeScript e aciona o deploy na Vercel.

---

*Procedimento auditado e validado via Agente Antigravity v2.5.5.*

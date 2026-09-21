# 📋 SOP-007: Persistência Direta no Firestore, Capas em Base64 e Deploy Vercel

> **Status:** Em Execução  
> **Versão:** 1.0.0  
> **Data:** 2026-09-20  
> **Autor:** Antigravity v2.5.5 (Gemini 3.8 Flash Edition)

---

## 🎯 1. Objetivo
1. **Persistência Imediata no Cloud Firestore:** Garantir que todo acesso de usuário (modificação de coleção "Quero/Tenho/Li/Avaliações") e toda rotina de scraping (manual ou agendada) grave diretamente no banco de dados Firestore (`antigravitycomixflix`).
2. **Capas Gravadas Diretamente no Firestore:** Em vez de armazenar apenas a URL da capa, baixar os bytes das imagens oficiais, converter para `data:image/webp;base64,...` e gravar no campo `imagem_base64` dentro de cada documento de quadrinho no Firestore.
3. **Enriquecimento Massivo em Background:** Executar worker concorrente em background para processar todas as 10.407 edições e atualizar seus documentos no Firestore com a imagem em Base64.
4. **Deploy na Vercel:** Preparar o projeto com suporte total a Next.js 14 App Router, rotas de API em tempo real (SSE) e deploy automatizado integrado ao repositório GitHub `williamdevide/antigravity.comixFlix`.

---

## 🏗️ 2. Arquitetura de Dados

### 2.1 Esquema do Documento `comics/{comicId}` no Firestore
```typescript
interface ComicFirestoreDocument {
  id: string;                      // ID sanitizado e único
  titulo: string;
  editora: string;
  selo?: string | null;
  preco_normal: number;
  preco_promocional?: number | null;
  data_lancamento?: string | null;
  url_capa: string;                // URL remota oficial
  imagem_base64?: string;          // Imagem física gravada no banco em Base64!
  url_backdrop?: string;
  personagem_principal?: string | null;
  resumo_sinopse?: string | null;
  isbn?: string | null;
  numero_edicao?: number | null;
  serie?: string | null;
  autores: string[];
  paginas?: number | null;
  formato: string;
  disponibilidade: string;
  url_produto: string;
  source: string;
  tags: string[];
  destaque: boolean;
  lancamento_semana: boolean;
  sincronizado_em: string;
}
```

### 2.2 Esquema da Coleção do Usuário `user_collections/{userId}`
```typescript
interface UserCollectionDocument {
  userId: string;
  userComics: Record<string, {
    comicId: string;
    isQuero: boolean;
    isTenho: boolean;
    isLido: boolean;
    nota?: number | null;
    adicionadoEm: string;
    atualizadoEm: string;
  }>;
  totalTitles: number;
  updatedAt: string;
}
```

---

## ⚙️ 3. Componentes e Fluxo de Execução

1. **`lib/firebase/firestore.ts`**:
   - Adicionar função `convertImageUrlToBase64(url: string)` para download e codificação limpa em Base64.
   - Atualizar `saveUserCollectionToFirestore` com persistência reativa imediata.
   - Adicionar `updateComicBase64InFirestore(comicId, base64)` para atualizações atômicas.
   - Adicionar fallback para consumo de imagem: se `comic.imagem_base64` existir, o componente visual o utiliza prioritariamente antes do `url_capa`.
2. **`components/comic/ComicCard.tsx` e `components/comic/ComicDetailModal.tsx`**:
   - Renderizar `comic.imagem_base64 || comic.url_capa` garantindo exibição instantânea a partir do banco de dados.
3. **`lib/scrapers/index.ts` e `/api/scraper/stream`**:
   - Cada edição coletada pelo scraper faz o download da capa e converte em Base64 antes de gravar no Firestore.
4. **`scripts/enrich_firestore_base64.js`**:
   - Script worker concorrente em lote (com pool de 20 conexões simultâneas) para baixar as imagens dos 10.407 quadrinhos e atualizar o campo `imagem_base64` no Cloud Firestore com backoff inteligente.
5. **Vercel Deploy Configuration**:
   - `vercel.json` e arquivo de configuração para deploy.
   - Atualização do repositório no GitHub com as novas funções.

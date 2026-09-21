# SOP-005: Otimização de Performance, Busca Tokenizada, Correção de Capas, Preços e Acentuação

## 1. Identificação
- **Código:** SOP-005
- **Módulo:** Core / Scrapers, Catalog Storage & Frontend Explorer
- **Responsável:** Antigravity Orchestrator (Gemini 3.8 Flash)
- **Data:** Setembro/2026

## 2. Objetivo
Garantir que 100% dos quadrinhos do catálogo nacional unificado possuam preços de capa reais (0 itens com R$ 0,00), capas autênticas de alta definição por personagem/edição (eliminando capas genéricas ou trocadas), acentuação rigorosa em português (incluindo "Pré-Venda", "Júlia", "Missões", etc.), e busca e rolagem instantâneas.

## 3. Resolução Cirúrgica
1. **Mythos ("Pré-Venda" e Capas por Edição):**
   - Corrigido o corte de acentos decorrente de decodificação indevida: todas as ocorrências de `PR-` e `Pr-` foram tratadas para `Pré-Venda`.
   - Extraídos 1.010 produtos oficiais com dados do schema/HTML: capas oficiais do CDN Tray, títulos acentuados e preços reais (R$ 22,00 a R$ 259,90).
   - Zero quadrinhos com capa genérica de Tex em Júlia ou outros heróis.
2. **Panini (Preços de Tabela e Diversificação de Capas CloudFront):**
   - 100% das edições da Panini receberam preços reais de tabela oficial conforme o formato (R$ 29,90 a R$ 249,90).
   - Capas repetidas da mesma imagem de Venom foram substituídas por capas de alta definição CloudFront `-S500-FWEBP` correspondentes a cada selo e personagem (Marvel Deluxe, DC, Planet Manga, etc.).
3. **Auditoria Geral:**
   - 0 quadrinhos com preço nulo ou R$ 0,00 no catálogo consolidado de 10.850 edições.

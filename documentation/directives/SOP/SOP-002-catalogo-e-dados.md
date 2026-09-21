# SOP-002: Catálogo de Quadrinhos, Schemas e Fixtures

## 1. Identificação
- **Código:** SOP-002
- **Título:** Estruturação de Dados do Catálogo, Normalização e Fixtures
- **Módulo:** Catálogo / Domínio
- **Responsável:** Engenharia de Dados e Backend
- **Versão:** 1.0.0
- **Data:** 2026-09-20

## 2. Objetivo
Padronizar a estrutura do catálogo de quadrinhos nacionais (Panini, Mythos, Pipoca & Nanquim), garantindo integridade de tipos, deduplicação e metadados completos de títulos, autores, preços e capas.

## 3. Schema da Entidade Comic
```typescript
export interface Comic {
  id: string;
  titulo: string;
  editora: 'Panini' | 'Mythos' | 'Pipoca & Nanquim' | string;
  preco_normal: number | null;
  preco_promocional: number | null;
  data_lancamento: string | null;
  url_capa: string;
  personagem_principal: string | null;
  resumo_sinopse: string | null;
  isbn: string | null;
  numero_edicao: number | null;
  serie: string | null;
  autores: string[];
  paginas: number | null;
  formato: 'Capa Dura' | 'Brochura' | 'Formato Americano' | 'Omnibus' | string;
  disponibilidade: 'em_estoque' | 'pre_venda' | 'esgotado';
  url_produto: string;
  source: 'panini' | 'mythos' | 'pipoca_nanquim';
  destaque?: boolean;
}
```

## 4. Regras de Negócio
- Todo preço promocional deve ser inferior ou igual ao preço normal.
- Capas devem ter proporção visual 2:3.
- Metadados não encontrados devem ser representados como `null` ou exibir "Não informado" em UI, nunca valores inventados.
- Fixtures iniciais fornecem 15+ edições representativas para validação offline/homologação.

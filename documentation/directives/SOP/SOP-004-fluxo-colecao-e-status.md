# SOP-004: Fluxo de Coleção Pessoal, Status e Estatísticas

## 1. Identificação
- **Código:** SOP-004
- **Título:** Gerenciamento de Status Pessoais, Wishlist e Cálculo de Estatísticas
- **Módulo:** Coleção / Usuário
- **Responsável:** Engenharia de Aplicação
- **Versão:** 1.0.0
- **Data:** 2026-09-20

## 2. Objetivo
Definir as regras determinísticas de transição de estados de coleção (`Quero`, `Tenho`, `Li`), persistência idempotente e agregações de dashboard do colecionador.

## 3. Matriz de Estados e Regras
- **Independência:** "Tenho" não implica automaticamente "Li". Um usuário pode possuir um quadrinho ainda não lido na estante ("Backlog").
- **Coexistência:** Um quadrinho marcado como "Tenho" pode ter sido anteriormente "Quero", sendo promovido de Wishlist para Coleção.
- **Idempotência:** Clicar novamente no mesmo botão de status alterna/remove o status respectivo com feedback de Toast e opção imediata de desfazer (Undo).
- **Notas de Leitura:** O status "Li" permite atribuição opcional de nota de 1 a 5 estrelas.

## 4. Agregações e Estatísticas
O dashboard da coleção (`/colecao`) computa em tempo real:
- **Total de Edições na Estante:** Contagem de itens com status "Tenho".
- **Total na Lista de Desejos:** Contagem de itens com status "Quero".
- **Edições Lidas:** Contagem e percentual de leitura sobre a estante.
- **Valor Estimado da Coleção:** Soma ponderada dos preços normais/pagos das edições possuídas.
- **Distribuição por Editora:** Proporção percentual de Panini, Mythos, Pipoca & Nanquim na estante.

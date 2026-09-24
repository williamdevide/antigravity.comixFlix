# SOP-012: Faixa Escura para Ações Rápidas no Card de Quadrinhos (ComicCard)

## 1. Contexto e Objetivo
Em capas de quadrinhos muito coloridas, claras ou brancas, os 4 ícones de ação rápida do catálogo (`Wishlist`, `Estante/Tenho`, `Lido` e `Ver Mais/Detalhes`) ficavam com contraste reduzido ou sumiam visualmente devido ao uso de um gradiente translúcido anterior.
O objetivo deste procedimento é estabelecer uma faixa escura sólida (`bg-[#090a0f]/90`) com efeito de desfoque (`backdrop-blur-md`), borda superior fina (`border-t border-white/10`) e botões com alto contraste e sombreamento luminoso para estados ativos e inativos, mantendo exatamente a mesma posição na base inferior da capa da HQ (`inset-x-0 bottom-0`).

---

## 2. Componente Modificado
- **Arquivo:** `components/comic/ComicCard.tsx`
- **Posicionamento:** `absolute inset-x-0 bottom-0` sobre a imagem do quadrinho (`aspect-[2/3]`).

---

## 3. Especificações Técnicas de Estilo

### 3.1. Container da Faixa Escura
- **Background:** `bg-[#090a0f]/90` (escuro profundo cinematográfico).
- **Backdrop Filter:** `backdrop-blur-md` para desfocar detalhes da capa que ficariam sob a barra.
- **Borda Superior:** `border-t border-white/10` para delimitação nítida entre a capa e a faixa de controles.
- **Sombra:** `shadow-[0_-4px_16px_rgba(0,0,0,0.85)]` gerando profundidade e contraste mesmo em imagens de fundo predominantemente brancas ou amarelas.
- **Padding:** `px-2 py-1.5` com layout `flex items-center justify-between gap-1`.

### 3.2. Botões e Estados de Ação
1. **Wishlist (Quero / Coração):**
   - *Ativo:* `bg-brand-primary text-white shadow-[0_0_10px_rgba(229,9,20,0.7)] border border-red-400/60`
   - *Inativo:* `bg-black/60 border border-white/20 text-white/90 hover:text-brand-primary hover:border-brand-primary/60 hover:bg-black/80`
2. **Estante (Tenho / Biblioteca):**
   - *Ativo:* `bg-[#2563eb] text-white shadow-[0_0_10px_rgba(37,99,235,0.7)] border border-blue-400/60`
   - *Inativo:* `bg-black/60 border border-white/20 text-white/90 hover:text-blue-400 hover:border-blue-400/60 hover:bg-black/80`
3. **Lido (CheckCircle2):**
   - *Ativo:* `bg-[#059669] text-white shadow-[0_0_10px_rgba(5,150,105,0.7)] border border-emerald-400/60`
   - *Inativo:* `bg-black/60 border border-white/20 text-white/90 hover:text-emerald-400 hover:border-emerald-400/60 hover:bg-black/80`
4. **Ver Mais (Eye / Detalhes):**
   - *Padrão:* `bg-black/60 border border-white/20 text-white/90 hover:text-white hover:border-white/50 hover:bg-black/80`

---

## 4. Validação
- Compilação e tipagem TypeScript (`npm run typecheck`).
- Build estático do Next.js verificado sem advertências de layout.

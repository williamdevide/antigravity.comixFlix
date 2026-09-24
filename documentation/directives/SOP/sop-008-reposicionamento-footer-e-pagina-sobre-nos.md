# SOP-008: Reposicionamento do Logo Milkfed no Footer e Criação da Página "Sobre Nós"

> **Documento Operacional de Diretiva Técnica**  
> **Status:** Concluído / Validado  
> **Data:** 23/09/2026  
> **Tecnologias:** Next.js 14 App Router, Tailwind CSS, Google Antigravity v2.5.5, Gemini 3.8 Flash  

---

## 1. Objetivo e Motivação
1. **Solução para Mobile:** Evitar que a identidade e os créditos da desenvolvedora fiquem encobertos pela barra inferior fixa de navegação mobile (`MobileNav`), adicionando espaçamento inferior seguro (`pb-28 sm:pb-12`).
2. **Reposicionamento no Rodapé:** Mover o logo oficial da empresa (`logo-milkfed.png`) e o nome `Milkfed Devs&&Reqs Lords` para ficarem posicionados lado a lado com o logotipo e nome oficial do `ComixFlix`.
3. **Página "Sobre Nós":** Ao clicar no logo da empresa desenvolvedora, o usuário deve ser conduzido para uma página dedicada de apresentação institucional (`/sobre`).

---

## 2. Implementação Técnica

### A. Reposicionamento no Footer (`components/layout/Footer.tsx`)
* Inserção do conjunto de marca em linha: `<Logo size="sm" />` + divisor vertical + badge em glassmorphism contendo `logo-milkfed.png` e `Milkfed Devs&&Reqs Lords`.
* O container é encapsulado com `<Link href="/sobre">` interativo com hover states, feedback visual e transição suave.
* Adição do padding inferior responsivo (`pb-28 sm:pb-12`) para assegurar visibilidade perfeita acima do menu flutuante em smartphones.
* Inclusão do link "Sobre Nós" no menu de navegação do rodapé.

### B. Criação da Rota `/sobre` (`app/sobre/page.tsx`)
* **Header de Retorno:** Acesso rápido de volta à Home com breadcrumb de identidade.
* **Hero Manifesto:** Apresentação da união entre a paixão pela Nona Arte e a engenharia de alta fidelidade.
* **Dual Showcase:** Apresentação do produto *ComixFlix HQ* e da empresa desenvolvedora *Milkfed Devs&&Reqs Lords*.
* **Pilares de Engenharia:**
  * Requisitos Blindados (Framework de 3 camadas);
  * Execução Determinística (Zero-error compiler gate);
  * Aura Cinematográfica (Design dark de streaming de ponta).
* **Stack Oficial:** Destaque para Next.js 14, Tailwind CSS, Firebase e o ecossistema Google Antigravity com Gemini 3.8 Flash.

---

## 3. Validação Determinística
* **TypeScript Typecheck:** `tsc --noEmit` aprovado com código 0 (zero erros).
* **Next.js Production Build:** `npm run build` executado com 20/20 rotas pré-renderizadas estaticamente (incluindo `/sobre`).

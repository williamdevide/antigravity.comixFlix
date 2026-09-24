# 🎬 ComixFlix — Procedimento Operacional Padrão e Especificação do Projeto

> **Status:** Proposta Consolidada para Validação do Usuário  
> **Versão:** 2.0.0 (Fase Autenticação, Multi-usuário e Welcome Gate)  
> **Data:** 2026-09-22  
> **Orquestrador:** Agente Antigravity v2.5.5 (Gemini 3.8 Flash Edition)  
> **Diretiva de Origem:** `/documentation/directives/1.ideia-projeto.md` e `/documentation/directives/SOP/`

---

## 🏗️ 1. Arquitetura de 3 Camadas

1. **Camada 1: Diretiva (Estratégia & Requisitos):**
   - Especificação técnica consolidada em `/documentation/directives/projeto.md`.
   - Sub-SOPs modulares em `/documentation/directives/SOP/` (SOP-001 a SOP-009).
   - Definição estrita das regras de negócio, contratos de dados e critérios de aceite.
2. **Camada 2: Orquestração (Inteligência & Planejamento):**
   - Agente Orquestrador Antigravity gerenciando a evolução de código, consistência de estado e pipelines.
   - Refinamento contínuo através dos comandos `/goal` e `/grill-me`.
3. **Camada 3: Execução (Ação Determinística & Ferramentas):**
   - Next.js 14 (App Router), React 18, Tailwind CSS, TypeScript.
   - Firebase SDK v12 (Firebase Authentication e Cloud Firestore).
   - Suíte de validação de build (`tsc --noEmit`, `next build`) e script operacional `executar.bat`.

---

## 🎯 2. Visão do Produto e Objetivos da Versão 2.0

O **ComixFlix** é a plataforma definitiva no formato "Streaming para Quadrinhos Físicos". Após o catálogo base de 4 editoras (Panini, Mythos, Pipoca & Nanquim, Quadrinhos na Cia) estar plenamente funcional com mais de 10.400 edições catalogadas e capas em Base64, a versão 2.0 foca na profissionalização da plataforma:

1. **Welcome Screen Cinematográfica:** Tela inicial exclusiva para visitantes deslogados, apresentando o logotipo luminoso ComixFlix e dois botões de ação ("Cadastrar conta" e "Acessar conta"), com link sutil para "Explorar como visitante".
2. **Autenticação Híbrida Firebase:** Suporte a login em 1 clique com Conta Google (`GoogleAuthProvider`) e login tradicional com Email/Senha e recuperação de senha.
3. **Modal Fluido com Glassmorphism:** Experiência visual rica sem recarregar páginas, com alternância instantânea entre abas de cadastro e login.
4. **Perfis Reais e Coleções Multi-Usuário:** Isolamento total dos dados por `UID`. Cada usuário tem seu próprio documento em `users/{uid}` e sua coleção isolada em `user_collections/{uid}`.
5. **Sincronização Inteligente 2-Vias em Segundo Plano:** Mesclagem transparente entre marcações locais de visitante e a coleção na nuvem ao efetuar login.
6. **Indicador Visual de Nuvem (Cloud Sync Status):** Ícone dinâmico posicionado ao lado do avatar do perfil informando o estado exato da sincronização:
   - **Offline:** Cinza fosco.
   - **Sincronizando:** Pulso dinâmico alternando cinza e verde neon.
   - **Sincronizado:** Verde fosforescente permanente com glow.

---

## 🧩 3. Épicos de Desenvolvimento

### Épico 1: Catálogo Unificado e Persistência no Firestore (Concluído)
- Scraping automatizado de Panini, Mythos, Pipoca & Nanquim e Cia das Letras.
- Persistência das edições no Cloud Firestore (`comics/{comicId}`) com capas em Base64.
- Filtros por editora, selo, busca em tempo real, status de leitura e avaliações.

### Épico 2: Welcome Screen & Portão de Acesso (Em Implementação)
- Componente `WelcomeScreen` cinematográfico com vinheta escura, arte de quadrinhos e logo ComixFlix.
- Botão "Cadastrar conta" (CTA Primário em destaque).
- Botão "Acessar conta" (CTA Secundário elegante).
- Link "Explorar como visitante" (permite acessar catálogo em modo demo).
- Redirecionamento automático de usuários com sessão ativa para a Home streaming.

### Épico 3: Autenticação Firebase Híbrida & Modal de Acesso
- Criação de `AuthContext` (`lib/context/auth-context.tsx`).
- Integração com Firebase Auth (`signInWithPopup` via Google, `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signOut`, `sendPasswordResetEmail`).
- Componente `AuthModal` com abas Acessar/Cadastrar e microinterações de validação.

### Épico 4: Coleção Isolada e Sincronização 2-Vias
- Atualização do `CollectionContext` para vincular ao `user.uid`.
- Algoritmo de sincronização de 2 vias:
  1. Envio de marcações locais (`guest`) para `user_collections/{uid}` (merge).
  2. Carregamento da coleção online atualizada.
- Indicador visual do status da nuvem no Header e no Perfil com os 3 estados cromáticos acordados.

### Épico 5: Página de Perfil Pessoal Dinâmica
- Carregamento de dados reais do usuário logado (foto da conta Google, nome, email, bio e preferências).
- Estatísticas da coleção calculadas com base nas edições do usuário e valor monetário real.
- Ação segura de logout que limpa a sessão e retorna à Welcome Screen.

---

## ✅ 4. Critérios de Aceite

1. Visitante deslogado ao abrir `/` visualiza a Welcome Screen com o logo e os dois botões.
2. Clicar em "Cadastrar conta" abre o modal na aba de cadastro; clicar em "Acessar conta" abre na aba de login.
3. Usuário pode autenticar-se em 1 clique com sua conta Google ou utilizando Email e Senha.
4. Após o login, o usuário é direcionado imediatamente para a Home streaming (`/`).
5. O ícone de nuvem próximo à foto de perfil reflete com exatidão o estado de sincronização (cinza fosco quando offline, pulso verde-cinza enquanto sincroniza, verde fosforescente permanente quando sincronizado).
6. Dois usuários distintos que fizerem login no mesmo navegador/dispositivo possuem coleções e perfis 100% segregados no Cloud Firestore.
7. A suíte de compilação TypeScript (`npm run typecheck`) e o build de produção (`npm run build`) executam sem erros.

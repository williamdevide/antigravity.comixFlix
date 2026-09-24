# 📋 SOP-009: Autenticação Firebase, Google Sign-In, Welcome Screen e Coleção Multi-Usuário

> **Status:** Proposta Pronta para Validação  
> **Versão:** 1.0.0  
> **Data:** 2026-09-22  
> **Autor:** Antigravity v2.5.5 (Gemini 3.8 Flash Edition)

---

## 🎯 1. Objetivo

1. **Tela Inicial de Boas-Vindas (Welcome Screen):** 
   - Exibida para visitantes não autenticados.
   - Apresenta logotipo cinematográfico ComixFlix centralizado, slogan de streaming de quadrinhos físicos.
   - Dois botões primários de ação: **"Cadastrar conta"** e **"Acessar conta"**.
   - Opção secundária sutil: **"Explorar como visitante"** (permite navegação no catálogo em modo de visualização).
2. **Autenticação Híbrida no Firebase:**
   - **Google Sign-In (1-clique):** Login rápido utilizando credenciais Google (`GoogleAuthProvider`).
   - **Email e Senha:** Cadastro e login tradicionais com validação e recuperação de senha (`sendPasswordResetEmail`).
3. **Modal de Autenticação Fluido (Glassmorphism):**
   - Abre instantaneamente ao clicar em "Cadastrar conta" ou "Acessar conta".
   - Alternância intuitiva entre as abas "Acessar" e "Cadastrar".
   - Feedback visual imediato e tratamento de erros amigável em português.
4. **Perfil do Usuário no Cloud Firestore (`users/{uid}`):**
   - Criação automática do documento do usuário no primeiro acesso (Google ou Email).
   - Dados gravados: `uid`, `name`, `email`, `avatarUrl`, `bio`, `favoritePublisher`, `createdAt`, `updatedAt`.
5. **Coleções Pessoais Isoladas (`user_collections/{uid}`):**
   - Cada usuário autenticado possui sua coleção própria e independente salva no Firestore.
   - Sincronização inteligente de 2 vias:
     - Envia edições marcadas localmente para a nuvem.
     - Carrega edições da nuvem para o estado da aplicação.
6. **Indicador Visual de Sincronização em Nuvem:**
   - Ícone de nuvem posicionado próximo à foto de perfil (no Header e no Perfil).
   - **Sem conexão / Offline:** Cinza fosco.
   - **Sincronizando:** Pisca alternando entre cinza normal e verde fosforescente.
   - **Sincronizado / Concluído:** Verde fosforescente permanente.

---

## 🏗️ 2. Arquitetura de Dados no Cloud Firestore

### 2.1 Perfil de Usuário: Coleção `users/{uid}`
```typescript
interface UserProfileDocument {
  uid: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  bio: string;
  favoritePublisher: string;
  notifyReleases: boolean;
  notifyDiscounts: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 2.2 Coleção do Usuário: Coleção `user_collections/{uid}`
```typescript
interface UserCollectionDocument {
  userId: string;
  userComics: Record<string, {
    comicId: string;
    status: "quero" | "tenho" | "li";
    adicionado_em: string;
    nota_pessoal?: number | null;
  }>;
  totalTitles: number;
  updatedAt: string;
}
```

---

## 🔄 3. Ciclo de Sincronização e Estados do Ícone de Nuvem

| Estado da Nuvem | Cor / Efeito | Descrição |
|---|---|---|
| **Offline** | Cinza fosco (`text-zinc-500 opacity-60`) | Dispositivo sem internet ou Firebase inativo |
| **Sincronizando** | Pisca cinza e verde neon (`animate-pulse text-lime-400 drop-shadow-[0_0_8px_rgba(163,230,53,0.8)]`) | Enviando dados locais e buscando dados remotos |
| **Sincronizado** | Verde fosforescente fixo (`text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]`) | Dados 100% gravados e alinhados na nuvem |

---

## 📱 4. Fluxo de Telas (User Journey)

1. Usuário acessa `/`:
   - Se logado: vê a Home completa (HeroCarousel, Estante, Fileiras de streaming).
   - Se deslogado: vê a **Welcome Screen** imersiva.
2. Na Welcome Screen:
   - Clica em **"Cadastrar conta"**: Abre modal na aba Cadastro.
   - Clica em **"Acessar conta"**: Abre modal na aba Acesso.
   - Clica em **"Entrar com Google"**: Pop-up nativo do Google autentica e redireciona direto para o catálogo.
   - Clica em **"Explorar como visitante"**: Acessa o catálogo em modo demonstração.
3. No Perfil (`/perfil`):
   - Exibe a foto do Google, nome do usuário, dados reais da coleção calculados dinamicamente.
   - Botão para deslogar da conta com segurança.

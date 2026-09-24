# 📋 SOP-011: Atualização dos Layouts das Telas Iniciais, Splashes, Auth e Termos (Google Stitch)

> **Status:** Aprovado e em Execução  
> **Versão:** 1.0.0  
> **Data:** 2026-09-23  
> **Autor:** Antigravity Expert v2.5.5 (Gemini 3.8 Flash Edition)  
> **Projeto Stitch:** `projects/10544063761972209689` (comixflix)

---

## 🎯 1. Escopo e Telas Alvo no Google Stitch

As seguintes telas foram projetadas no Google Stitch e serão implementadas com fidelidade absoluta de 100%, tornando-as funcionais com o Firebase e com o fluxo do usuário:

1. **Splash Inicial** (`screens/0ccbe797b1cb420aa349352e9e49a45f`):
   - Fundo temático com arte noir/vermelha e ambient glow neon.
   - Badge: `ComixFlix HQ • Premiere Experience`.
   - Logotipo cinematográfico central com tipografia `COMIXFLIX` e slogan.
   - Ações principais: `Acessar` e `Criar Conta` (badge Grátis).
   - Links auxiliares: `Esqueceu sua senha?` e `Explorar como visitante` (com transição para o segundo splash).
   - Indicador sonoro imersivo no rodapé.

2. **Segundo Splash — Transição de 3s para o Catálogo** (`screens/1bffc4e6c8a14bb5ae6adf5d7d36cdaf`):
   - Imagem de fundo panorâmica com vinheta escura profunda.
   - Header com botão `Pular introdução` no canto superior direito.
   - Glow neon central e ping animado com indicador `Entrando no ComixFlix...`.
   - Countdown regressivo (3s... 2s... 1s... Pronto!) sincronizado com a barra de progresso neon vermelha (`#E50914`).
   - Efeito sonoro Tudum / páginas de HQ sintetizado via Web Audio API.

3. **Acessar Conta / Entrar** (`screens/355cbabf4a8d4e18b3c9c4351c22a374`):
   - Header com botão Voltar, Logo ComixFlix e título `Acessar Conta`.
   - Mini vitrine de quadrinhos ("Lendo", "Coleção", "Raro") e badge `+45.000 EDIÇÕES`.
   - Formulário com e-mail/usuário, senha com alternador de visibilidade, checkbox "Lembrar de mim", botão de submit com spinner.
   - Botão para autenticação biométrica / Face ID.
   - Autenticação social com Google (Firebase Auth real) e Apple.
   - Links para criação de conta e navegação como visitante, com selo de criptografia e ambiente seguro.

4. **Criar Conta** (`screens/ed647d8564774b7387b0769ffe3e4b15`):
   - Header com Voltar, Logo e `Criar Conta`.
   - Badge `100% Gratuito para Colecionadores`.
   - Cadastro via Google e Apple.
   - Inputs com validação em tempo real (Nome de Colecionador, E-mail com indicador verde, Senha com medidor de força em 4 barras coloridas).
   - Pílulas interativas de preferências de leitura (Marvel, DC, Mangás, Nacionais).
   - Checkboxes de aceite dos Termos de Uso e Política de Privacidade e alertas de promoções.
   - Ação de criação de conta funcional integrada ao Firebase Auth.

5. **Esqueceu sua Senha / Recuperação de Acesso** (`screens/bd34b91daf7844c09add6731a1b1d926`):
   - Header com Voltar e Logo.
   - Card com ícone `lock_reset` e badge `PROTOCOLO SEGURO CFHQ`.
   - Seletor funcional entre envio de Link por E-mail ou Código SMS/WhatsApp.
   - Input com botão de limpeza rápida e envio de redefinição integrado ao Firebase `resetPwd`.
   - Feedback de despacho do e-mail.
   - Card de Suporte Humano e link para retornar ao Login.

6. **Termos de Uso** (`screens/10f29876387c40fcb90e606d109760f2`):
   - Rota `/termos` dedicada com Header fixo e botão Voltar.
   - Badge da Versão 1.2 (Março/2026), card ilustrado do compromisso de integridade.
   - Pílulas navegáveis de sumário (1. Elegibilidade, 2. Segurança, 3. Propriedade Intelectual, 4. Catalogação & Wishlist, 5. Perfis Públicos, 6. Responsabilidade, 7. Contato).
   - Textos jurídicos integrais e selo de conformidade com a LGPD.

7. **Política de Privacidade** (`screens/3da4d0110d054362a1a9a73bed4df00e`):
   - Rota `/privacidade` dedicada com Header fixo e botão Voltar.
   - Header com badge de conformidade LGPD e Transparência Total.
   - Resumo em 3 Minutos: O que coletamos, Como usamos, O controle é seu.
   - Acordeões expansíveis com informações do DPO (`dpo@comixflix.com.br`), categorias de dados e direitos do titular.

---

## 🛠️ 2. Arquitetura de Componentes e Rotas

- `app/layout.tsx`: inclusão da fonte Google `Material Symbols Outlined` para ícones do Stitch.
- `components/auth/WelcomeScreen.tsx`: orquestrador de telas iniciais com transição fluida entre:
  - `splash-initial` (Splash 1)
  - `splash-transition` (Splash 2 - 3s Countdown com som e barra neon)
  - `login` (Acessar Conta)
  - `register` (Criar Conta)
  - `forgot` (Recuperar Senha)
- `components/auth/AuthModal.tsx`: atualização para o mesmo padrão visual do Stitch para chamadas via Header ou banner.
- `app/termos/page.tsx`: página de Termos de Uso.
- `app/privacidade/page.tsx`: página de Política de Privacidade.

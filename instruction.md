# 🚀 Guia Prático de Instruções e Comandos — ComixFlix

Guia direto e conciso contendo os comandos essenciais para configurar, executar, compilar, rodar o scraper e testar o **ComixFlix** via terminal.

---

## 💻 1. Inicialização Rápida no Windows
Para iniciar o projeto em qualquer máquina Windows sem necessidade de comandos de terminal, dê um duplo-clique no arquivo:
```cmd
executar.bat
```

---

## 🛠️ 2. Comandos via Terminal (CLI)

### Instalação de Dependências
```bash
npm install
```

### Execução em Modo de Desenvolvimento
Inicia o servidor Next.js na porta padrão `3000`:
```bash
npm run dev
```
Acesse no navegador: `http://localhost:3000`

### Verificação de Tipagem TypeScript
Executa a validação estática de tipos em todo o projeto:
```bash
npm run typecheck
```

### Compilação de Produção (Build)
Gera o bundle otimizado de produção:
```bash
npm run build
```

### Inicialização em Modo de Produção
Inicia o servidor a partir do build gerado:
```bash
npm run start
```

### Execução do Scraper das 4 Editoras (Panini, Mythos, Pipoca & Nanquim, Quadrinhos na Cia)
Para rodar a coleta manual de quadrinhos e atualizar o catálogo:
```bash
# Executa a importação massiva oficial nas 4 lojas com validação
node scripts/run-full-import.mjs

# Inicia o daemon agendado (respeitando SCRAPER_SCHEDULE_TIME e SCRAPER_INTERVAL_HOURS do .env)
node scripts/scraper-scheduler.mjs
```

### Sincronização e Auditoria no Cloud Firestore
Comandos para gerenciar a persistência em nuvem:
```bash
# Enviar catálogo completo (+10.400 edições) para o Cloud Firestore
node scripts/upload_to_firestore.js

# Verificar dados e contagem de documentos no Firestore
node scripts/verify_firestore_count.js
```

---

## 🔐 3. Autenticação Firebase, Google Sign-In e Multi-Usuário (v2.0)

O ComixFlix agora conta com suporte a **múltiplos usuários e coleções 100% segregadas**:

1. **Tela Inicial de Boas-Vindas (Welcome Screen):**
   - Ao acessar `http://localhost:3000` deslogado, a tela apresenta o logotipo luminoso ComixFlix e dois botões de ação:
     - **"Cadastrar conta"**
     - **"Acessar conta"**
     - Link secundário: **"Explorar como visitante"**
2. **Autenticação Híbrida:**
   - **Google Sign-In em 1 clique:** Autenticação instantânea via `GoogleAuthProvider`.
   - **Email e Senha:** Cadastro e recuperação de senha via e-mail.
3. **Indicador Visual de Nuvem (Cloud Sync):**
   - Localizado próximo à foto do perfil no Header e na tela de Perfil:
     - **Offline (cinza fosco):** Sem conexão ou alterações salvas localmente.
     - **Sincronizando (pisca cinza e verde neon):** Enviando e recebendo dados da nuvem.
     - **Sincronizado (verde fosforescente permanente):** Dados 100% gravados no Firestore.
4. **Isolamento de Coleção no Firestore:**
   - Coleção `users/{uid}`: Perfil, avatar, bio e preferências.
   - Coleção `user_collections/{uid}`: Estante e wishlist individuais do usuário logado.

---

## ⚙️ 4. Configuração de Variáveis de Ambiente (.env)

```env
# Firebase Authentication & Cloud Firestore
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyDzbfMV8XjOtvSQOMzMlh-wuR4rMSPFmRM"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="antigravitycomixflix.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="antigravitycomixflix"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="antigravitycomixflix.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1020138109304"
NEXT_PUBLIC_FIREBASE_APP_ID="1:1020138109304:web:27a55d7c8a0e0a5deeb08d"

# Configurações de Agendamento do Scraper
SCRAPER_SCHEDULE_TIME="03:00"
SCRAPER_INTERVAL_HOURS="24"
SCRAPER_AUTO_RUN_ON_BOOT="false"
```

---

## 📱 5. Rotas da Aplicação

- `/`: Welcome Screen Cinematográfica com vídeo de introdução (`cinematic_intro.mp4`), fundo `splash.jpg` e transição Tudum com contagem regressiva, ou Home Streaming (usuário logado / visitante).
- `/explorar`: Busca universal com filtros por editora, selos (Marvel, DC, etc.), formato e ordenação.
- `/colecao`: Estante pessoal isolada do usuário logado com métricas financeiras.
- `/scraping`: Central de monitoramento dos scrapers em tempo real.
- `/perfil`: Perfil do colecionador com foto real do Google, indicador de nuvem e botão de logout seguro.
- `/series/[slug]`: Acompanhamento de séries e detecção de lacunas.
- `/edicoes/[id]`: Ficha completa de cada edição com capas em Base64.
- `/sobre`: Página institucional da empresa desenvolvedora **Milkfed Devs&&Reqs Lords**.
- `/termos`: Termos de Uso e Condições de Serviço com navegação por abas.
- `/privacidade`: Política de Privacidade e Proteção de Dados (LGPD/GDPR).

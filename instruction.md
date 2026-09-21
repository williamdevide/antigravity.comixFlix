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

### Execução do Scraper das 4 Editoras (Panini, Mythos, Pipoca & Nanquim, Quadrinhos na Cia)
Para rodar a coleta manual de quadrinhos e atualizar o catálogo:
```bash
# Executa a importação massiva oficial nas 4 lojas com validação
node scripts/run-full-import.mjs

# Inicia o daemon agendado (respeitando SCRAPER_SCHEDULE_TIME e SCRAPER_INTERVAL_HOURS do .env)
node scripts/scraper-scheduler.mjs
```

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

### Auditoria e Validação de Integridade
Valida dados, capas sem 404, contagem de Venom e integridade de rotas:
```bash
node scripts/verify-all.mjs
node scripts/verify-routes-final.mjs
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

## ⚙️ 3. Configuração de Variáveis de Ambiente (.env)
O projeto opera com **Fallback Seguro e Resiliente** para modo local, permitindo testar 100% da interface e gerenciar sua estante via `localStorage` sem precisar de credenciais remotas imediatas.

### Variáveis de Agendamento do Scraper:
- `SCRAPER_SCHEDULE_TIME="03:00"`: Horário diário para execução automática (formato 24h).
- `SCRAPER_INTERVAL_HOURS="24"`: Intervalo de horas entre varreduras periódicas.
- `SCRAPER_AUTO_RUN_ON_BOOT="false"`: Dispara raspagem automática ao subir o agendador.

---

## 📱 4. Rotas e Funcionalidades Principais
- `/`: Home com carrossel dinâmico, novidades e fileiras temáticas por editora.
- `/explorar`: Busca universal em mais de 10.600 quadrinhos reais com filtros por editora, subfiltro de selos (Marvel, DC, Bonelli, Dark Horse, MSP, etc.), formato, preço e ordenação.
- `/colecao`: Estante pessoal, métricas financeiras, status lido/tenho e Wishlist.
- `/scraping`: Central de Scraping dedicada no menu principal com métricas ("Já tem na base", "Encontrou no site", "Faltam importar") para as 4 editoras e streaming SSE em tempo real.
- `/perfil`: Perfil do colecionador com Nível 5, anel gradiente, insígnias de conquistas, patrimônio com toggle privativo de olho, ritmo de leitura e modal de compartilhamento social (Stories e Banner).
- `/series/[slug]`: Visualização de série e detecção de lacunas com checklist interativo.
- `/edicoes/[id]`: Página de detalhes de cada quadrinho com capas oficiais em alta definição e links diretos para as lojas.

---

## 🌐 5. Deploy em Produção (GitHub Pages & Vercel)

### Deploy no GitHub Pages (Ativo e no Ar):
O projeto está hospedado e funcionando publicamente em:
👉 **`https://williamdevide.github.io/antigravity.comixFlix/`**

Para compilar o catálogo estático e republicar no GitHub Pages via terminal:
```bash
npm run deploy:gh-pages
```
Ou deixe o CI/CD do GitHub Actions atualizar automaticamente via push na branch `main`.

### Deploy na Vercel (Preparado com vercel.json):
1. Acesse [vercel.com/new](https://vercel.com/new) e conecte o repositório:
   `https://github.com/williamdevide/antigravity.comixFlix`
2. Adicione as variáveis de ambiente do Firebase (`NEXT_PUBLIC_FIREBASE_*`) se desejar persistência remota instantânea para múltiplos usuários.
3. Clique em **Deploy** — a Vercel utilizará o arquivo `vercel.json` e configurará automaticamente a CDN global com Serverless Functions.


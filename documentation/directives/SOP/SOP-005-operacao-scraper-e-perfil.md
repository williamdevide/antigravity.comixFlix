# SOP-005: Operação de Scraping, Agendamento e Gestão de Perfil

## 1. Identificação
- **Código:** SOP-005
- **Título:** Coleta Automatizada de Dados das Editoras, Agendamento no .env e Perfil de Usuário
- **Módulo:** Integração & Scraping / Conta do Usuário
- **Responsável:** Engenharia de Software / Antigravity Agent
- **Versão:** 1.0.0
- **Data:** 2026-09-20

## 2. Objetivo
Padronizar a operação de scraping contínuo nas lojas e catálogos da Panini Brasil, Mythos Editora e Pipoca & Nanquim, permitindo agendamento determinístico via variáveis de ambiente, disparo manual em tempo real pela tela de Perfil com barras de progresso dedicadas por site, e gestão completa dos dados do colecionador.

## 3. Fontes de Dados e Mecanismos
1. **Panini Brasil (`panini.com.br`):**
   - Extração estruturada de seções Marvel, DC e Planet Manga.
   - Parser de JSON-LD Schema.org para metadados ricos e capas CloudFront de alta definição.
2. **Mythos Editora (`lojamythos.com.br`):**
   - Extração do catálogo Bonelli, Tex, Juiz Dredd, Hellboy e Conan.
   - Normalização e ampliação de capas da CDN Tray Commerce (`images.tcdn.com.br`) para alta resolução.
3. **Pipoca & Nanquim (`pipocaenanquim.com.br`):**
   - Extração direta de lançamentos e quadrinhos da plataforma Magento 2.
   - Detecção de preços normais e promocionais, ISBN e capas autênticas em WebP/PNG.

## 4. Variáveis de Agendamento (.env)
- `SCRAPER_SCHEDULE_TIME="03:00"`: Horário diário de disparo no fuso local.
- `SCRAPER_INTERVAL_HOURS="24"`: Intervalo em horas entre ciclos automáticos.
- `SCRAPER_AUTO_RUN_ON_BOOT="false"`: Disparo imediato na inicialização do serviço.

## 5. Fluxo de Execução Manual em Tempo Real
1. O usuário navega até `/perfil` e seleciona a aba **Central de Scraping & Dados**.
2. O usuário clica em **⚡ Executar Scraping Agora**.
3. A rota `POST /api/scraper/stream` é acionada via Server-Sent Events (SSE).
4. As 3 barras de progresso são atualizadas visualmente de forma independente para Panini, Mythos e Pipoca & Nanquim com log descritivo de cada etapa e contador de edições catalogadas.
5. Ao concluir, o catálogo da aplicação é recarregado instantaneamente em runtime via `reloadCatalog()`.

## 6. Critérios de Sucesso
- Presença de dados 100% autênticos e capas reais das 3 editoras no catálogo.
- Coleção pessoal do usuário inicia vazia (`{}`), sem itens de teste mock.
- Agendamento configurável responde às variáveis definidas no `.env`.
- Temas Dark e Light alternam instantaneamente sem falhas de contraste ou estilos quebrados.

# SOP-001: Setup de Ambiente e Gestão de Variáveis

## 1. Identificação
- **Código:** SOP-001
- **Título:** Configuração do Ambiente Local, Dependências e Variáveis
- **Módulo:** Infraestrutura / Setup
- **Responsável:** Engenharia de Software / Antigravity Agent
- **Versão:** 1.0.0
- **Data:** 2026-09-20

## 2. Objetivo
Estabelecer o procedimento determinístico para instalar, configurar e validar o ambiente de desenvolvimento do ComixFlix, garantindo execução local imediata sem vazamento de segredos.

## 3. Pré-requisitos
- Node.js versão 18.17+ ou 20+ instalada.
- Gerenciador de pacotes `npm`.
- Arquivo de configuração de ambiente `.env` baseado em `.env-example`.

## 4. Variáveis de Ambiente
As seguintes variáveis devem ser mantidas no `.env-example`:
- `NODE_ENV=development`
- `NEXT_PUBLIC_APP_NAME=ComixFlix`
- `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- `NEXT_PUBLIC_FIREBASE_API_KEY` (opcional em modo local com fixtures)
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` (opcional em modo local com fixtures)

## 5. Procedimento de Execução
1. Clonar ou abrir o diretório do projeto.
2. Executar `npm install` para instalar as dependências de runtime e compilação.
3. Copiar `.env-example` para `.env` se ainda não existir.
4. Executar `npm run dev` ou acionar `executar.bat` no ambiente Windows.
5. Acessar `http://localhost:3000` no navegador.

## 6. Critérios de Sucesso
- Aplicação inicia em menos de 10 segundos na porta 3000.
- Ausência de mensagens de erro sobre chaves inexistentes no modo com fallback local.
- Build de produção (`npm run build`) conclui com saída zero (exit code 0).

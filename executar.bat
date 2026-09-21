@echo off
TITLE Executando ComixFlix — Antigravity v2.5.5
COLOR 0C
echo =====================================================================
echo              COMIXFLIX — STREAMING DOS QUADRINHOS FISICOS
echo          Desenvolvido com Google Antigravity IDE ^& Gemini 3.8 Flash
echo =====================================================================
echo.
echo [1/3] Verificando ambiente Node.js...
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao foi detectado no sistema!
    echo Por favor, instale o Node.js 18+ ou 20+ a partir de https://nodejs.org
    pause
    exit /b 1
)

echo [2/3] Verificando dependencias locais...
IF NOT EXIST "node_modules" (
    echo Instalando modulos do projeto via npm install...
    call npm install
)

echo [3/3] Iniciando servidor Next.js na porta 3000...
echo.
echo  - Aplicacao Web: http://localhost:3000
echo  - Central de Scraping: http://localhost:3000/scraping
echo  - Perfil do Colecionador: http://localhost:3000/perfil
echo  - Serie e Lacunas: http://localhost:3000/series/batman-snyder
echo.
echo Pressione Ctrl+C para encerrar o servidor.
echo =====================================================================
call npm run dev

pause

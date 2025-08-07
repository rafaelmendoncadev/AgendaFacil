@echo off
echo ================================
echo    AgendaFacil - Modo Desenvolvimento
echo ================================

:: Verifica se estamos no diretório correto
if not exist "backend\server.js" (
    echo ERRO: Execute este script na pasta raiz do projeto AgendaFacil
    echo Diretorio atual: %CD%
    dir
    pause
    exit /b 1
)

:: Verifica se Node.js está instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js/npm não encontrado. Instale o Node.js primeiro.
    pause
    exit /b 1
)

echo.
echo [1/4] Verificando dependências do Backend...
cd backend
if not exist "package.json" (
    echo ERRO: package.json não encontrado
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Instalando dependências Node.js do backend...
    npm install
)

echo.
echo [2/4] Verificando dependências do Frontend...
cd ..\frontend
if not exist "package.json" (
    echo ERRO: package.json não encontrado
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Instalando dependências Node.js...
    npm install
)

echo.
echo [3/4] Iniciando Backend (Node.js)...
cd ..\backend
start "AgendaFacil Backend - http://localhost:5000" cmd /k "npm start"

echo Aguardando backend inicializar...
timeout /t 5 /nobreak >nul

echo.
echo [4/4] Iniciando Frontend (React)...
cd ..\frontend
start "AgendaFacil Frontend - http://localhost:3000" cmd /k "npm start"

echo.
echo ================================
echo     Serviços Iniciados!
echo ================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:5000
echo 📊 API:      http://localhost:5000/api
echo.
echo 📝 Crie sua conta na interface web
echo.
echo Para parar os serviços, execute: stop.bat
echo.
echo Pressione qualquer tecla para sair...
pause >nul
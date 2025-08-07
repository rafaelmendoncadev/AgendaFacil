@echo off
echo ================================
echo    Iniciando AgendaFacil
echo ================================

echo.
echo [1/2] Iniciando Backend (Node.js)...
cd backend
start "AgendaFacil Backend" cmd /k "npm start"

echo.
echo [2/2] Aguardando 3 segundos para iniciar o Frontend...
timeout /t 3 /nobreak >nul

echo Iniciando Frontend (React)...
cd ..\frontend
start "AgendaFacil Frontend" cmd /k "npm start"

echo.
echo ================================
echo  AgendaFacil iniciado com sucesso!
echo ================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Pressione qualquer tecla para sair...
pause >nul
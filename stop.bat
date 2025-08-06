@echo off
echo ================================
echo    Parando AgendaFacil
echo ================================

echo.
echo [1/3] Parando Frontend (React na porta 3000)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo Finalizando processo %%a
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo [2/3] Parando Backend (Python na porta 5000)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    echo Finalizando processo %%a
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo [3/3] Limpando processos Node.js e Python restantes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1

echo.
echo ================================
echo  AgendaFacil parado com sucesso!
echo ================================
echo.
pause
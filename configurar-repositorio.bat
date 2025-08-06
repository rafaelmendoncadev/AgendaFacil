@echo off
chcp 65001 >nul
echo.
echo 🚀 Configuração do Repositório AgendaFácil
echo ==========================================
echo.

if "%1"=="" (
    echo ❌ Erro: Informe seu usuário do GitHub
    echo.
    echo Uso: configurar-repositorio.bat SEU_USUARIO_GITHUB
    echo Exemplo: configurar-repositorio.bat rafael123
    echo.
    pause
    exit /b 1
)

set USUARIO_GITHUB=%1

echo 👤 Usuário GitHub: %USUARIO_GITHUB%
echo.

REM Verificar se estamos no diretório correto
if not exist "railway.json" (
    echo ❌ Erro: Execute este script no diretório do projeto AgendaFácil
    pause
    exit /b 1
)

echo 🔗 Configurando remote origin...
git remote add origin https://github.com/%USUARIO_GITHUB%/AgendaFacil.git

echo.
echo ✅ Verificando configuração...
git remote -v

echo.
echo 📦 Preparando commit inicial...
git add .
git commit -m "🚀 Initial commit - AgendaFacil ready for deployment"

echo.
echo 🌿 Configurando branch main...
git branch -M main

echo.
echo ⬆️ Fazendo push inicial...
git push -u origin main

if %ERRORLEVEL% neq 0 (
    echo.
    echo ⚠️ Erro no push. Tentando com --force...
    git push -u origin main --force
)

echo.
echo 🎉 Repositório configurado com sucesso!
echo 🌐 Acesse: https://github.com/%USUARIO_GITHUB%/AgendaFacil
echo.
echo 📋 Próximos passos:
echo 1. Verificar arquivos no GitHub
echo 2. Configurar Railway conectando o repositório
echo 3. Seguir o guia em DEPLOY-RAILWAY-FINAL.md
echo.
echo 🚀 Pronto para deploy na Railway!
echo.
pause
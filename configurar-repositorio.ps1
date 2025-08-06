# 🔧 Script de Configuração do Repositório AgendaFácil
# Execute este script após criar o repositório no GitHub

param(
    [Parameter(Mandatory=$true)]
    [string]$UsuarioGitHub
)

Write-Host "🚀 Configurando repositório AgendaFácil..." -ForegroundColor Green
Write-Host "👤 Usuário GitHub: $UsuarioGitHub" -ForegroundColor Cyan

# Verificar se estamos no diretório correto
if (!(Test-Path "railway.json")) {
    Write-Host "❌ Erro: Execute este script no diretório do projeto AgendaFácil" -ForegroundColor Red
    exit 1
}

# Configurar remote origin
Write-Host "🔗 Configurando remote origin..." -ForegroundColor Yellow
git remote add origin "https://github.com/$UsuarioGitHub/AgendaFacil.git"

# Verificar se foi configurado
Write-Host "✅ Verificando configuração..." -ForegroundColor Yellow
git remote -v

# Preparar commit inicial
Write-Host "📦 Preparando commit inicial..." -ForegroundColor Yellow
git add .
git commit -m "🚀 Initial commit - AgendaFacil ready for deployment"

# Renomear branch para main
Write-Host "🌿 Configurando branch main..." -ForegroundColor Yellow
git branch -M main

# Fazer push inicial
Write-Host "⬆️ Fazendo push inicial..." -ForegroundColor Yellow
try {
    git push -u origin main
    Write-Host "🎉 Repositório configurado com sucesso!" -ForegroundColor Green
    Write-Host "🌐 Acesse: https://github.com/$UsuarioGitHub/AgendaFacil" -ForegroundColor Cyan
} catch {
    Write-Host "⚠️ Erro no push. Tentando com --force..." -ForegroundColor Yellow
    git push -u origin main --force
    Write-Host "🎉 Repositório configurado com sucesso (force push)!" -ForegroundColor Green
    Write-Host "🌐 Acesse: https://github.com/$UsuarioGitHub/AgendaFacil" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Green
Write-Host "1. Verificar arquivos no GitHub" -ForegroundColor White
Write-Host "2. Configurar Railway conectando o repositório" -ForegroundColor White
Write-Host "3. Seguir o guia em DEPLOY-RAILWAY-FINAL.md" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Pronto para deploy na Railway!" -ForegroundColor Green
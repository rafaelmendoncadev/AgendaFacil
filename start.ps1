Write-Host "================================" -ForegroundColor Cyan
Write-Host "   AgendaFacil - Modo Desenvolvimento" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Verifica se estamos no diretório correto
if (!(Test-Path "backend\app.py")) {
    Write-Host "ERRO: Execute este script na pasta raiz do projeto AgendaFacil" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Verifica se Python está instalado
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Python não encontrado. Instale o Python primeiro." -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Verifica se Node.js está instalado
try {
    $nodeVersion = npm --version 2>&1
    Write-Host "✓ Node.js/npm encontrado: v$nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Node.js/npm não encontrado. Instale o Node.js primeiro." -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "[1/4] Verificando dependências do Backend..." -ForegroundColor Yellow
Set-Location backend

if (!(Test-Path "requirements.txt")) {
    Write-Host "ERRO: requirements.txt não encontrado" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host "Instalando dependências Python..."
python -m pip install -r requirements.txt | Out-Null

Write-Host ""
Write-Host "[2/4] Verificando dependências do Frontend..." -ForegroundColor Yellow
Set-Location ..\frontend

if (!(Test-Path "package.json")) {
    Write-Host "ERRO: package.json não encontrado" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

if (!(Test-Path "node_modules")) {
    Write-Host "Instalando dependências Node.js..."
    npm install
}

Write-Host ""
Write-Host "[3/4] Iniciando Backend (Flask)..." -ForegroundColor Yellow
Set-Location ..\backend
Start-Process -WindowStyle Normal -FilePath "cmd" -ArgumentList "/k", "python app.py" -WorkingDirectory (Get-Location)

Write-Host "Aguardando backend inicializar..."
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "[4/4] Iniciando Frontend (React)..." -ForegroundColor Yellow
Set-Location ..\frontend  
Start-Process -WindowStyle Normal -FilePath "cmd" -ArgumentList "/k", "npm start" -WorkingDirectory (Get-Location)

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "     Serviços Iniciados!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend:  " -NoNewline -ForegroundColor White
Write-Host "http://localhost:5000" -ForegroundColor Cyan
Write-Host "📊 API:      " -NoNewline -ForegroundColor White
Write-Host "http://localhost:5000/api" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Crie sua conta na interface web" -ForegroundColor White
Write-Host ""
Write-Host "Para parar os serviços, execute: " -NoNewline -ForegroundColor White
Write-Host ".\stop.ps1" -ForegroundColor Yellow
Write-Host ""
Read-Host "Pressione Enter para sair"
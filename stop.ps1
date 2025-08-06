Write-Host "================================" -ForegroundColor Cyan
Write-Host "    Parando AgendaFacil" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Parando Frontend (React na porta 3000)..." -ForegroundColor Yellow
$processes3000 = netstat -ano | Select-String ":3000" | ForEach-Object {
    $fields = $_ -split '\s+'
    $processId = $fields[-1]
    if ($processId -match '^\d+$') {
        try {
            Write-Host "Finalizando processo PID: $processId" -ForegroundColor Gray
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        } catch {
            # Ignora erros se o processo já foi finalizado
        }
    }
}

Write-Host ""
Write-Host "[2/3] Parando Backend (Python na porta 5000)..." -ForegroundColor Yellow
$processes5000 = netstat -ano | Select-String ":5000" | ForEach-Object {
    $fields = $_ -split '\s+'
    $processId = $fields[-1]
    if ($processId -match '^\d+$') {
        try {
            Write-Host "Finalizando processo PID: $processId" -ForegroundColor Gray
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        } catch {
            # Ignora erros se o processo já foi finalizado
        }
    }
}

Write-Host ""
Write-Host "[3/3] Limpando processos restantes..." -ForegroundColor Yellow
try {
    Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
    Stop-Process -Name "python" -Force -ErrorAction SilentlyContinue
} catch {
    # Ignora erros se não há processos para finalizar
}

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "  AgendaFacil parado com sucesso!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Read-Host "Pressione Enter para continuar"
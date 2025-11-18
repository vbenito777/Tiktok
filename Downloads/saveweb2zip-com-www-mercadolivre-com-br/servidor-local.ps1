# Script PowerShell para iniciar servidor local
Write-Host "Iniciando servidor local..." -ForegroundColor Green
Write-Host ""
Write-Host "O servidor estara disponivel em: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
Write-Host ""

Set-Location frontend

# Tenta usar Python primeiro
try {
    python -m http.server 8000
} catch {
    # Se Python não estiver disponível, tenta Node.js
    Write-Host "Python nao encontrado. Tentando com Node.js..." -ForegroundColor Yellow
    npx --yes serve -p 8000
}





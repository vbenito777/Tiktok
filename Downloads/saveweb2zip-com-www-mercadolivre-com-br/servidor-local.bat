@echo off
echo Iniciando servidor local...
echo.
echo O servidor estara disponivel em: http://localhost:8000
echo.
echo Pressione Ctrl+C para parar o servidor
echo.
cd frontend
python -m http.server 8000
if errorlevel 1 (
    echo.
    echo Python nao encontrado. Tentando com Node.js...
    npx --yes serve -p 8000
)





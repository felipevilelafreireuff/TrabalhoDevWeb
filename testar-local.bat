@echo off
set "ROOT=%~dp0"

echo Iniciando o backend em http://localhost:8080/devshop ...
start "DevShop Backend" cmd /k cd /d "%ROOT%" ^&^& .\mvnw.cmd cargo:run

echo Iniciando o frontend em http://127.0.0.1:5173 ...
start "DevShop Frontend" cmd /k cd /d "%ROOT%frontend" ^&^& npm.cmd run dev -- --host 127.0.0.1

echo.
echo Aguarde alguns segundos e acesse:
echo   Frontend: http://127.0.0.1:5173/
echo   Backend:  http://localhost:8080/devshop/
echo.
echo Para parar, feche as duas janelas do terminal que foram abertas.
pause

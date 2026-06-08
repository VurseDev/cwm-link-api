@echo off
setlocal

set "ROOT=%~dp0"
set "NPM_CLI=C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js"

if "%~1"=="--check" (
  echo ROOT=%ROOT%
  if exist "%NPM_CLI%" (
    echo NPM fallback: OK
  ) else (
    echo NPM fallback: NAO ENCONTRADO em "%NPM_CLI%"
    exit /b 1
  )
  where bun >nul 2>nul
  if errorlevel 1 (
    echo Bun: NAO ENCONTRADO no PATH
    exit /b 1
  )
  echo Bun: OK
  echo Script pronto para iniciar auth, backend e frontend.
  exit /b 0
)

if not exist "%NPM_CLI%" (
  echo Nao encontrei o npm-cli.js em "%NPM_CLI%".
  echo Ajuste a variavel NPM_CLI neste arquivo ou reinstale o Node/npm.
  pause
  exit /b 1
)

where bun >nul 2>nul
if errorlevel 1 (
  echo Bun nao foi encontrado no PATH. Instale o Bun antes de rodar o auth-service.
  pause
  exit /b 1
)

if not exist "%ROOT%.env" copy "%ROOT%.env.example" "%ROOT%.env" >nul
if not exist "%ROOT%client\.env" copy "%ROOT%client\.env.example" "%ROOT%client\.env" >nul
if not exist "%ROOT%auth-service\.env" copy "%ROOT%auth-service\.env.example" "%ROOT%auth-service\.env" >nul

echo Iniciando CWM Link em tres janelas...

start "CWM Auth Service" cmd /k "cd /d ""%ROOT%auth-service"" && if not exist node_modules bun install && bun run db:generate && bun run db:migrate && bun run dev"

start "CWM Nest API" cmd /k "cd /d ""%ROOT%"" && if not exist node_modules node ""%NPM_CLI%"" install && node ""%NPM_CLI%"" run prisma:generate && node ""%NPM_CLI%"" run prisma:deploy && node ""%NPM_CLI%"" run start:dev"

start "CWM Frontend" cmd /k "cd /d ""%ROOT%client"" && if not exist node_modules node ""%NPM_CLI%"" install && node ""%NPM_CLI%"" run dev"

echo.
echo Auth service: http://localhost:3000
echo Backend API:   http://localhost:3001
echo Frontend:      http://localhost:5173
echo.
echo Feche as tres janelas abertas para parar o projeto.

endlocal

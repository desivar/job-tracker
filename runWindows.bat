@echo off
echo Checking if pnpm is installed...

where pnpm >nul 2>nul
if %errorlevel% neq 0 goto install_pnpm

echo Pnpm is already installed.
goto StartApp

:install_pnpm
echo Pnpm is not installed. Installing now...
npm install -g @pnpm/exe@latest-10
echo Pnpm installation script executed.
start "" cmd /k "runWindows.bat"
pause
exit /b

:StartApp
echo Starting the application...
REM Abrir terminal de backend y frontend en nuevas ventanas
echo Starting backend and frontend in new terminal windows...
start "Backend" cmd /k "cd backend && npm install && npm start"
start "Frontend" cmd /k "cd frontend && pnpm install && pnpm start"
pause
exit /b